const express = require("express");
const router = express.Router();
const passport = require("passport");
const signUpController = require("../controllers/sign_up_controller");

router.post("/register", signUpController.create_new_user);

/* Authenticate users login */
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: false,
    failureMessage: true,
  }),
  (req, res) => {
    // console.log(req);
    return res.json({ message: "Success" });
  }
);

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
