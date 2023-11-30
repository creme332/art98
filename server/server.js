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

const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const User = require("./models/user");
const Pixel = require("./models/pixel");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

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
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "random-secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
// ! routes must be after middlewares
app.use("/", indexRouter);
app.use("/auth", authRouter);

// passportjs stuffs
passport.use(
  new LocalStrategy(
    {
      // https://stackoverflow.com/questions/34511021/passport-js-missing-credentials
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      console.log(email, password);

      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { error: "Email does not exist." });
        }
        console.log("User valid");

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          console.log("Passwords invalid");
          // passwords do not match!
          return done(null, false, { error: "Invalid password." });
        }
        console.log("Passwords valid");
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log(`user logged in: ${user.id}`);

  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`user ${id} logged out`);

  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// socket.io stuffs
let userCount = 0;
const canvasBuffer = [];

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`);
  userCount++;
  io.emit("userCount", userCount);

  // console.log(socket.handshake.auth); // get data defined by client

  // Listen to pixel changes
  socket.on("message", async (pixel) => {
    console.log(pixel);

    // send updated pixel to all users
    io.emit("messageResponse", pixel);

    // TODO: merge changes into buffer
    // check if data.position already in buffer.
    // if yes, simply modify. else add new entry
    canvasBuffer.push(pixel);

    // every 10 pixel changes, save state of canvas to database
    if (canvasBuffer.length == 10) {
      console.log("Backing up changes to database.");

      console.log(canvasBuffer);
      // save changes to mongodb

      // TODO: Include canvas id as well if there is more than 1 canvas.
      await Promise.all(
        canvasBuffer.map((p) =>
          Pixel.findOneAndUpdate(
            { position: p.position },
            { $set: { color: p.color } },
            {}
          )
        )
      );

      pixelCount = 0;
      canvasBuffer.length = 0; // reset buffer
    }
  });

  socket.on("disconnect", () => {
    userCount--;
    console.log(`user ${socket.id} disconnected`);
    io.emit("userCount", userCount);
  });
});
