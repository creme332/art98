const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const authController = require("../controllers/auth_controller");

router.post("/register", authController.create_new_user);

/* Authenticate users login */
router.post("/login", authController.authenticate_user);

/* Deal with user log out*/
router.post("/logout", (req, res, next) => {
  console.log(`logout ${req.session.id}`);

  // TODO: close socket

  /**
   * Invoking logout() will remove the req.user property
   *  and clear the login session (if any).
   *
   *  Reference: https://www.passportjs.org/concepts/authentication/logout/
   *  */
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return res.status(200).send();
  });
});

module.exports = router;
