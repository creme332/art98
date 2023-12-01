const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const passport = require("passport");
const signUpController = require("../controllers/sign_up_controller");

router.post("/register", signUpController.create_new_user);

/* Authenticate users login */
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // console.log(err, user, info);
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send(info);
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).send(user);
    });
  })(req, res, next);
});

/* Deal with user log out*/
router.post("/logout", (req, res, next) => {
  console.log(`logout ${req.session.id}`);

  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return res.status(200).send();
  });
});

module.exports = router;
