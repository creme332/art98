const User = require("../models/user");
const asyncHandler = require("express-async-handler");

exports.user_data = asyncHandler(async (req, res, next) => {
  // check if user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: "User is not authenticated" });
  }

  // fetch user data from database
  const data = await User.findOne({ email: req.user.email });
  if (!data) {
    return res.status(400).json({ error: "Invalid email" });
  }

  return res.status(200).json(data);
});
