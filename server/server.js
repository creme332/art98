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

const passport = require("passport");
const passportStrategy = require("./utils/passport").strategy;
const session = require("express-session");
const User = require("./models/user");
const Pixel = require("./models/pixel");

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
let userCount = 0;
const canvasBuffer = []; // stores pixels to be updated

/**
 * Maps pixel position to index of canvasBuffer storing corresponding pixel data
 *
 * Index must be a string.
 */
let pixelPositionToBufferIndex = {};

io.on("connection", (socket) => {
  console.log(`new connection ${socket.id}`);
  console.log(socket.request.user);

  console.log(`user ${socket.id} connected`);
  userCount++;
  io.emit("userCount", userCount);

  // if canvas buffer is non-empty, emit buffer to clients

  // console.log(socket.handshake.auth); // get data defined by client

  // Listen to pixel changes
  socket.on("message", (updatedPixel) => {
    // TODO: Validate updatedPixel

    // send updated pixel to all users
    io.emit("messageResponse", updatedPixel);

    // get string format of updated pixel position
    const pixelPosition = updatedPixel.position.toString();
    const bufferIndex = pixelPositionToBufferIndex[pixelPosition];

    // attach user id to pixel
    updatedPixel.author = socket.request.user.id;

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
    if (canvasBuffer.length == 10) {
      uploadCanvasBuffer();
    }
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`);

    // update count of online users and notify listeners
    userCount--;
    io.emit("userCount", userCount);

    // when last user leaves the game,
    // save remaining data in buffer to database
    if (userCount == 0) uploadCanvasBuffer();
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
