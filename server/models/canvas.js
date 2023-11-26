const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CanvasSchema = new Schema({
  size: { type: Number, required: true, default: 300 },
  pixels: [{ type: Schema.Types.ObjectId, ref: "Pixel" }],
});

module.exports = mongoose.model("Canvas", CanvasSchema);
