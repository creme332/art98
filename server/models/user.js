const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 5 },
  name: { type: String, required: true, minLength: 5, maxLength: 20 },
  type: {
    type: String,
    required: true,
    enum: ["Basic", "Premium", "Admin"],
    default: "Basic",
  },
});

module.exports = mongoose.model("User", UserSchema);
