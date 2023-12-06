/**
 * This script populates initializes your newly created database.
 * Run it using node in server directory. It will take 3-4 minutes to execute.
 * NOTE: A .env file must be present in server folder and it must
 * contain your mongo connection string
 * ! If you want to execute the script more than once, delete your
 * ! art98 database first.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const Pixel = require("./models/pixel");
const Canvas = require("./models/canvas");

/**
 * The greater the canvas size, the more time it will take to create
 * canvas and its respective pixels on MongoDB.
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

  // create users
  await createUsers();

  console.log("Debug: Closing mongoose");

  mongoose.connection.close();
}

/**
 * Creates 3 users, one of each type, in database
 */
async function createUsers() {
  console.log("Debug: Creating 3 users..");

  // ! Do not change email and password for demo account
  // ! as frontend relies on these credentials
  await Promise.all([
    createUser("admin@art98.com", "admin-user", "Admin", "admin-password"),
    createUser(
      "premium@art98.com",
      "premium-user",
      "Premium",
      "premium-password"
    ),
    createUser("demo@art98.com", "demo-user", "Basic", "aaaaaa"),
  ]);

  console.log("Debug: Finished.");
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
 * @param {String} email User email
 * @param {String} name Username
 * @param {String} type Type of user: basic, premium, admin
 * @param {String} password Password of user
 */
async function createUser(email, name, type, password) {
  const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({
    email,
    name,
    type,
    password: hashedPassword,
  });
  await user.save();
}

/**
 * Links a pixel object to a canvas by pushing pixelID to the array field
 * in canvas document.
 * @param {mongoose.Schema.Types.ObjectId} canvasID Object ID of canvas
 * @param {mongoose.Schema.Types.ObjectId} pixelID Object ID of pixel
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
  const pixels = [];
  console.log(`Debug: Creating ${totalPixels} pixel documents locally...`);

  for (let position = 0; position < totalPixels; position++) {
    const pixelData = {
      position,
      color: "#FFFFFF",
      canvas: canvasID,
    };
    const pixel = new Pixel(pixelData);
    pixels.push(pixel);
  }
  console.log("Debug: Finished.");

  console.log("Debug: Pushing documents to pixels database...");
  await Promise.all(pixels.map((p) => p.save()));
  console.log("Debug: Finished.");

  console.log("Debug: Linking pixels database and canvas database...");
  await Promise.all(pixels.map((p) => linkToCanvas(canvasID, p._id)));
  console.log("Debug: Completed.");
}
