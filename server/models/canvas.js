const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const { canvasSize } = require("../utils/common");

const CanvasSchema = new Schema({
  size: { type: Number, required: true, default: canvasSize },
  pixels: [{ type: Schema.Types.ObjectId, ref: "Pixel" }],
});

module.exports = mongoose.model("Canvas", CanvasSchema);
