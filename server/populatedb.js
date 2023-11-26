#! /usr/bin/env node

/**
 * This script populates initialises your newly created database.
 * ! A .env file must be present in server folder and it must contain your mongo connection string
 *
 */

require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/user");
const Pixel = require("./models/pixel");
const Canvas = require("./models/canvas");

const canvasSize = 2; // 300x300 pixels

mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(process.env.MONGO_STRING);
  console.log("Debug: Connected");

  // create empty canvas
  const canvasID = new mongoose.Types.ObjectId();
  await createEmptyCanvas(canvasID);

  // create pixels for empty canvas
  await createPixels(canvasID);

  // add array of newly created pixels to canvas
  await saveToCanvas();

  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function createEmptyCanvas(canvasID) {
  const newCanvas = new Canvas({
    _id: canvasID,
    size: canvasSize,
  });
  await newCanvas.save();
}

async function saveToCanvas(canvasID, pixelID) {
  await Canvas.findByIdAndUpdate(canvasID, {
    $push: { pixels: pixelID },
  }).exec();
}

async function createUser(email, name, type, password) {
  const user = new User({ email, name, type, password });
  await user.save();
  users.push(user);
  console.log(`Added user: ${name}`);
}

async function createPixels(canvasID) {
  let arr = [];
  for (let position = 0; position < canvasSize * canvasSize; position++) {
    const _id = new mongoose.Types.ObjectId();
    const pixelData = {
      _id,
      position,
      color: "white",
      canvas: canvasID,
    };
    const pixel = new Pixel(pixelData);
    await pixel.save();
    // ! Order in which pixels are placed in Canvas is important.
    // ! Do not use Promise.all to save all pixels at once as the order of pixels in the pixels array will not be preserved.
    await saveToCanvas(canvasID, pixel._id);
  }
}
