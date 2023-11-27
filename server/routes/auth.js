const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const signUpController = require("../controllers/sign_up_controller");

router.get("/register", (req, res, next) => {
  res.json({ message: "works" });
});

router.post("/register", signUpController.create_new_user);

/* Authenticate users login */
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

module.exports = router;
