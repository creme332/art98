const bcrypt = require("bcryptjs");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

exports.create_new_user = asyncHandler(async (req, res, next) => {
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
        res.redirect("/");
      } catch (err) {
        return res.status(401).send({ error: JSON.stringify(err) });
      }
    }
  });
});
