/**
 * This script populates initializes your newly created database.
 * Run it using node in server directory.
 * NOTE: A .env file must be present in server folder and it must
 * contain your mongo connection string
 * ! If you want to execute the script more than once, delete your
 * ! art98 database first.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const Pixel = require("./models/pixel");
const Canvas = require("./models/canvas");

/**
 * The greater the canvas size, the more time it will take to create
 * canvas and its respective pixels on MongoDB. A 100x100 grid takes 10 minutes.
 */
const canvasSize = 100; // 100x100 pixels

mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));

/**
 * Driver function.
 */
async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(process.env.MONGO_STRING);
  console.log("Debug: Connected");

  // create empty canvas
  const canvasID = new mongoose.Types.ObjectId();
  await createEmptyCanvas(canvasID);

  // create pixels for empty canvas
  await createPixels(canvasID);

  // create an administrator
  createUser("john@gmail.com", "john", "admin", "password");

  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

/**
 * Creates a new canvas and saves it to MongoDB.
 * @param {mongoose.Schema.Types.ObjectId} canvasID ObjectID of canvas
 */
async function createEmptyCanvas(canvasID) {
  const newCanvas = new Canvas({
    _id: canvasID,
    size: canvasSize,
  });
  await newCanvas.save();
}

/**
 * Saves data for a new user in database
 * @param {String} email
 * @param {String} name
 * @param {String} type Type of user: basic, premium, admin
 * @param {String} password
 */
async function createUser(email, name, type, password) {
  const user = new User({ email, name, type, password });
  await user.save();
  users.push(user);
  console.log(`Added user: ${name}`);
}

/**
 * Links a pixel object to a canvas by pushing pixelID to the array field
 * in canvas document.
 * @param {mongoose.Schema.Types.ObjectId} canvasID
 * @param {mongoose.Schema.Types.ObjectId} pixelID
 */
async function linkToCanvas(canvasID, pixelID) {
  await Canvas.findByIdAndUpdate(canvasID, {
    $push: { pixels: pixelID },
  }).exec();
}

/**
 * Saves a document for each pixel in a canvas
 * @param {mongoose.Schema.Types.ObjectId} canvasID ObjectID of canvas
 */
async function createPixels(canvasID) {
  const totalPixels = canvasSize * canvasSize;
  console.log(`Debug: Saving ${totalPixels} pixel documents to MongoDB...`);

  for (let position = 0; position < totalPixels; position++) {
    const _id = new mongoose.Types.ObjectId();
    const pixelData = {
      _id,
      position,
      color: "white",
      canvas: canvasID,
    };
    const pixel = new Pixel(pixelData);
    await pixel.save();
    // ! Order in which pixels are placed in pixels array field is important.
    // ! Do not use Promise.all to save all pixels at once as the
    // ! order of pixels in the pixels array will not be preserved.
    await linkToCanvas(canvasID, pixel._id);
  }
  console.log("Debug: Completed.");
}
