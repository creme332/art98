require("dotenv").config();
const port = normalizePort(process.env.PORT || "4000");

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

// connect to mongodb
mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_STRING);
}

app.set("port", port);
server.listen(port);
server.on("error", onError);
server.on("listening", () => {
  console.log(`Listening on http://localhost:${port}/`);
});

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/auth", authRouter);

// socket.io stuffs
let userCount = 0;

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`);
  userCount++;
  io.emit("userCount", userCount);

  // console.log(socket.handshake.auth); // get data defined by client

  // Listens and logs the message to the console
  socket.on("message", (data) => {
    console.log(data);

    // sends the message to all the users on the server
    io.emit("messageResponse", data);
  });

  socket.on("disconnect", () => {
    userCount--;
    console.log(`user ${socket.id} connected`);
    io.emit("userCount", userCount);
  });
});

/**
 *  Normalize a port into a number, string, or false.
 * @param {*} val port number
 * @returns {integer}  normalized port
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 * @param {*} error error
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}
