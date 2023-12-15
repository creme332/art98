const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { colorValidator, canvasSize } = require("../utils/common");

const PixelSchema = new Schema({
  position: {
    type: Number,
    required: true,
    min: 0,
    max: canvasSize * canvasSize - 1,
  },
  color: {
    type: String,
    required: true,
    validate: [colorValidator, "Invalid color"],
  },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  canvas: { type: Schema.Types.ObjectId, ref: "Canvas", required: true },
  timestamp: { type: Schema.Types.Date },
});

PixelSchema.index({ canvas: 1, position: 1 }, { unique: true });

module.exports = mongoose.model("Pixel", PixelSchema);
