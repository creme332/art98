const bcrypt = require("bcryptjs");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  uniqueEmailChain,
  usernameChain,
  passwordChain,
  userTypeChain,
  secretChain,
  confirmPasswordChain,
  validateChains,
  emailChain,
} = require("../middlewares/validator");
const passport = require("passport");

exports.create_new_user = [
  uniqueEmailChain(),
  usernameChain(),
  userTypeChain(),
  secretChain(),
  passwordChain(),
  confirmPasswordChain(),
  validateChains, // ! validate must be at the end of the chain
  asyncHandler(async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log(err);
      } else {
        try {
          const user = new User({
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
            type: req.body.type,
          });
          const result = await user.save();
          console.log(result);
          return res.status(200).send();
        } catch (err) {
          return res.status(401).send({ error: JSON.stringify(err) });
        }
      }
    });
  }),
];

exports.authenticate_user = [
  emailChain(),
  passwordChain(),
  validateChains,
  asyncHandler((req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).send(info);
      }
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Login failed." });
        }
        res.status(200).send();
      });
    })(req, res, next);
  }),
];
