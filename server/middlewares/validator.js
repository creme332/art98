require("dotenv").config();

const { body, validationResult } = require("express-validator");
const User = require("../models/user");

const emailChain = () =>
  body("email").trim().escape().isEmail().withMessage("Invalid email.");

const uniqueEmailChain = () =>
  emailChain().custom(async (email) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("A user already exists with this e-mail address");
    }
    return true;
  });

const usernameChain = () =>
  body("name")
    .trim()
    .isLength({ min: 5, max: 20 })
    .escape()
    .withMessage("Name must have 5-20 characters.");

const passwordChain = () =>
  body("password")
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage("Password must have at least 5 characters.");

const userTypeChain = () =>
  body("type")
    .trim()
    .escape()
    .custom((value) => {
      return value === "Basic" || value === "Premium" || value === "Admin";
    })
    .withMessage("Invalid user type");

const confirmPasswordChain = () =>
  body("confirmPassword")
    .trim()
    .escape()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords do not match");

const secretChain = () =>
  body("secret")
    .custom((value, { req }) => {
      const type = req.body.type;

      // ignore secret if user is basic
      if (type == "Basic") {
        return true;
      }

      // for all other users, secret must be provided
      if (!value) {
        throw new Error("Secret must be provided");
      }

      // if user is premium, validate secret
      if (type === "Premium" && process.env.PREMIUM_KEY !== value) {
        throw new Error("Invalid secret");
      }

      // if user is admin, validate secret
      if (type === "Admin" && process.env.ADMIN_KEY !== value) {
        throw new Error("Invalid secret");
      }

      return true;
    })
    .withMessage("Invalid secret");
const validateChains = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(401).json({
    error: `${errors
      .array()
      .map((e) => e.msg)
      .join()}`,
  });
};

module.exports = {
  emailChain,
  uniqueEmailChain,
  usernameChain,
  passwordChain,
  userTypeChain,
  secretChain,
  confirmPasswordChain,
  validateChains,
};
