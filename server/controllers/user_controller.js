const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  userTypeChain,
  secretChain,
  validateChains,
} = require("../middlewares/validator");

exports.user_data = asyncHandler(async (req, res, next) => {
  // check if user is authenticated
  // console.log(req);

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

exports.upgrade_plan = [
  userTypeChain(),
  secretChain(),
  validateChains,
  asyncHandler(async (req, res, next) => {
    // check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: "User is not authenticated" });
    }
    console.log(req.body);
    // update user type
    try {
      await User.findOneAndUpdate(
        { email: req.user.email },
        { $set: { type: req.body.type } },
        {}
      );
      req.session.destroy();

      return res.status(200).send();
    } catch (error) {
      return res.status(200).json({ error: "User not found" });
    }
  }),
];
