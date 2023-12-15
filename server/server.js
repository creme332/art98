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
const MongoStore = require("connect-mongo");

const User = require("./models/user");
const Pixel = require("./models/pixel");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

const { colorValidator } = require("./utils/common");

const frontendURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://art98.vercel.app";
const corsOptions = {
  origin: frontendURL,
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
// ! Must trust proxy for cookie to be set on client
app.set("trust proxy", true);
app.set("port", port);
server.listen(port);
server.on("error", (error) => {
  console.log(error);
});
server.on("listening", () => {
  console.log(
    process.env.NODE_ENV === "development"
      ? `Listening on http://localhost:${port}/`
      : "Listening on https://art98-backend.onrender.com/"
  );
});

// middlewares

const cookieInfo =
  process.env.NODE_ENV === "development"
    ? {
        // cookie used for localhost
        maxAge: 7 * 1000 * 60 * 60 * 24, // one week
      }
    : {
        // production cookie (does not work on localhost)
        secure: true,
        sameSite: "none",
        maxAge: 7 * 1000 * 60 * 60 * 24, // one week
      };
/**
 * Session info
 *
 * Note: cookie info is not necessary for localhost development but
 * essential when deploying: https://stackoverflow.com/a/75152794/17627866
 */
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "random-secret",
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  cookie: cookieInfo,
  store: new MongoStore({
    mongoUrl: process.env.MONGO_STRING,
  }),
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
    "onlineUsernames",
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

  console.log(`user ${connectedUser.name} connected`);

  onOnlineUserChange(connectedUser, true);

  // if canvas buffer is non-empty, emit buffer to connected client
  if (canvasBuffer.length > 0) {
    canvasBuffer.forEach((pixel) => {
      // console.log(pixel);
      socket.emit("messageResponse", pixel);
    });
  }

  // Listen to pixel changes
  socket.on("message", async (updatedPixel) => {
    // validate updatedPixel
    if (updatedPixel.position === null || !colorValidator(updatedPixel.color)) {
      return;
    }

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
        io.to(socket.id).emit("limitExceeded");
        return;
      }
    }

    // attach information to pixel to be sent to all clients
    const detailedPixel = {
      ...updatedPixel,
      author: connectedUser.name,
      timestamp: new Date(),
    };

    // send pixel to all users
    io.emit("messageResponse", detailedPixel);

    // get string format of updated pixel position
    const pixelPosition = updatedPixel.position.toString();
    const bufferIndex = pixelPositionToBufferIndex[pixelPosition];

    // attach author id and timestamp to pixel
    updatedPixel.author = connectedUser.id;
    updatedPixel.timestamp = detailedPixel.timestamp;

    // check if pixel already in buffer
    if (bufferIndex >= 0) {
      // pixel is already found in buffer so modify it
      canvasBuffer[bufferIndex] = updatedPixel;
    } else {
      // pixel is not present in buffer so create a new entry
      canvasBuffer.push(updatedPixel);
      pixelPositionToBufferIndex[pixelPosition] = canvasBuffer.length - 1;
    }

    // save state of canvas to database incrementally to avoid massive updates
    if (canvasBuffer.length === databaseRefreshRate) {
      uploadCanvasBuffer();
    }
  });

  socket.on("resetCanvas", async () => {
    // Allow only admins to reset canvas
    if (connectedUser.type !== "Admin") return;

    // if canvas is already being cleared, ignore
    if (canvasClearOngoing) return;

    // disable drawing
    canvasClearOngoing = true;

    // clear buffer
    canvasBuffer.length = 0;
    pixelPositionToBufferIndex = {};

    // order clients to reset their respective canvas
    // * This approach is faster than emitting color for each pixel
    io.emit("resetCanvasResponse");

    // reset pixels in database
    await Pixel.updateMany(
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
    console.log(`user ${connectedUser.name} disconnected`);

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
            position: p.position,
          },
          {
            $set: {
              color: p.color,
              timestamp: p.timestamp,
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
