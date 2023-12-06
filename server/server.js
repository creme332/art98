require("dotenv").config();
const port = 4000;
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const { RateLimiterMemory } = require("rate-limiter-flexible");

const passport = require("passport");
const passportStrategy = require("./utils/passport").strategy;
const session = require("express-session");

const User = require("./models/user");
const Pixel = require("./models/pixel");
const Canvas = require("./models/canvas");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST"],
};
const io = require("socket.io")(server, corsOptions);

// connect to mongodb
mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));

/**
 * Connect to mongoDB
 */
async function main() {
  await mongoose.connect(process.env.MONGO_STRING);
}

// server setup
app.set("port", port);
server.listen(port);
server.on("error", (error) => {
  console.log(error);
});
server.on("listening", () => {
  console.log(`Listening on http://localhost:${port}/`);
});

// middlewares
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "random-secret",
  resave: false,
  saveUninitialized: false,
});
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Reference: https://github.com/socketio/socket.io/blob/master/examples/passport-example/index.js#L76-L80
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("Unauthorized"));
  }
});

// routes
// ! routes must be after middlewares
app.use("/", indexRouter);
app.use("/auth", authRouter);

// passportjs stuffs
passport.use(passportStrategy);
passport.serializeUser((user, done) => {
  console.log(`serializeUser: ${user.id}`);

  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`deserializeUser: ${id}`);

  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// socket.io stuffs
let onlineUsers = []; // array of objects for currently online users

/**
 * Stores unique changes made to pixels since
 * the canvas was last updated on mongoddb
 *
 * A newly logged in user fetches canvas from
 * database which may be outdated. The canvasBuffer contains the required
 * changes to be made to the canvas to make it up-to-date.
 */
const canvasBuffer = [];

/**
 * Save changes made to canvas to database at most
 * every 10 unique (by position) pixels modified.
 *
 * If all users are logged out, then all contents of canvasBuffer
 * are saved to database.
 */
const databaseRefreshRate = 10;

const basicRateLimiter = new RateLimiterMemory({
  points: 5, // 5 points
  duration: 60, // per minute
});
const premiumRateLimiter = new RateLimiterMemory({
  points: 20, // 20 points
  duration: 60, // per minute
});

/**
 * Checks if a client has exceeding his limit
 * @param {string} userEmail Email of user
 * @param {string} userType type of user
 * @returns {boolean} True if rate limit has not been exceeded
 *  and false otherwise
 */
async function checkRateLimit(userEmail, userType) {
  try {
    // consume 1 point per event for basic and premium users
    if (userType === "Basic") {
      await basicRateLimiter.consume(userEmail);
    }
    if (userType === "Premium") {
      await premiumRateLimiter.consume(userEmail);
    }
    return true;
  } catch (rejRes) {
    // no available points to consume
    return false;
  }
}

/**
 *
 * @param {*} changedUser affected user
 * @param {boolean} joined  has user joined or left?
 */
function onOnlineUserChange(changedUser, joined) {
  // send names of online users to all clients
  if (joined) {
    onlineUsers.push(changedUser);
  } else {
    onlineUsers = onlineUsers.filter((user) => user.id !== changedUser.id);
  }
  io.emit(
    "online-usernames",
    onlineUsers.map((user) => user.name)
  );
}

/**
 * Maps pixel position to index of canvasBuffer storing corresponding pixel data
 *
 * Index must be a string.
 */
let pixelPositionToBufferIndex = {};

/**
 * Indicates whether canvas is currently being erased by an admin.
 */
let canvasClearOngoing = false;

io.on("connection", (socket) => {
  console.log(`new connection ${socket.id}`);
  const connectedUser = socket.request.user;

  console.log(`user ${socket.id} connected`);

  onOnlineUserChange(connectedUser, true);

  // if canvas buffer is non-empty, emit buffer to connected client
  if (canvasBuffer.length > 0) {
    canvasBuffer.forEach((pixel) => {
      console.log(pixel);
      socket.emit("messageResponse", pixel);
    });
  }

  // Listen to pixel changes
  socket.on("message", async (updatedPixel) => {
    // validate updatedPixel
    if (updatedPixel.position === null || updatedPixel.color === null) return;

    // if canvas is being cleared by an admin, prevent drawing
    if (canvasClearOngoing) return;

    // check if non-admin users have exceeded their limits
    if (connectedUser.type !== "Admin") {
      const rateLimitExceeded = !(await checkRateLimit(
        connectedUser.email,
        connectedUser.type
      ));
      if (rateLimitExceeded) {
        console.log("Limit exceeded");
        // inform user that his he has exceeded the rate limit
        io.to(socket.id).emit("limit-exceeded");
        return;
      }
    }

    // send updated pixel to all users
    io.emit("messageResponse", updatedPixel);

    // get string format of updated pixel position
    const pixelPosition = updatedPixel.position.toString();
    const bufferIndex = pixelPositionToBufferIndex[pixelPosition];

    // attach user id to pixel
    updatedPixel.author = connectedUser.id;

    // check if pixel already in buffer
    if (bufferIndex >= 0) {
      // pixel is already found in buffer so modify it
      canvasBuffer[bufferIndex] = updatedPixel;
    } else {
      // pixel is not present in buffer so create a new entry
      canvasBuffer.push(updatedPixel);
      pixelPositionToBufferIndex[pixelPosition] = canvasBuffer.length - 1;
    }
    // console.log(pixelPositionToBufferIndex);
    // console.log(canvasBuffer);

    // save state of canvas to database incrementally to avoid massive updates
    if (canvasBuffer.length === databaseRefreshRate) {
      uploadCanvasBuffer();
    }
  });

  socket.on("reset-canvas", () => {
    // Allow only admins to reset canvas
    if (connectedUser.type !== "Admin") return;

    // if canvas is already being cleared, ignore
    if (canvasClearOngoing) return;

    // disable drawing
    canvasClearOngoing = true;

    // clear buffer
    canvasBuffer.length = 0;
    pixelPositionToBufferIndex = {};

    // clear canvas in real-time
    for (let position = 0; position < 100 * 100; position++) {
      io.emit("messageResponse", { position, color: "#FFFFFF" });
    }

    // upload empty canvas to database
    Canvas.updateMany(
      {},
      {
        $set: {
          color: "#FFFFFF",
          timestamp: new Date(),
          author: connectedUser.id,
        },
      }
    );

    // re-enable drawing
    canvasClearOngoing = false;
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`);

    // remove disconnected user from onlineUsers
    onOnlineUserChange(socket.request.user, false);

    // when last user leaves the game,
    // save remaining data in buffer to database
    if (onlineUsers.length == 0) uploadCanvasBuffer();
  });
});

/**
 * Uploads canvasBuffer array to mongodb
 */
function uploadCanvasBuffer() {
  if (canvasBuffer.length > 0) {
    console.log("Saving canvas changes to database.");

    // send updates to mongodb in parallel
    Promise.all(
      canvasBuffer.map((p) =>
        Pixel.findOneAndUpdate(
          {
            // TODO: Include canvas id if there is more than 1 canvas.
            position: p.position,
          },
          {
            $set: {
              color: p.color,
              timestamp: new Date(),
              author: p.author,
            },
          },
          {}
        )
      )
    );

    // reset buffer while updates are ongoing
    // * No need to await above promise
    canvasBuffer.length = 0;
    pixelPositionToBufferIndex = {};
  }
}
