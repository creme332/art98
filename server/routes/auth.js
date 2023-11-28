const express = require("express");
const router = express.Router();
const passport = require("passport");
const signUpController = require("../controllers/sign_up_controller");

router.post("/register", signUpController.create_new_user);

/* Authenticate users login */
router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    // console.log(err, user, info);
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send(info);
    }
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.status(200).send(user);
    });
  })(req, res, next);
});

/* Deal with user log out*/
router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.send();
  });
});

module.exports = router;
