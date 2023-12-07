const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.strategy = new LocalStrategy(
  {
    // https://stackoverflow.com/questions/34511021/passport-js-missing-credentials
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    console.log(email, password);

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { error: "Email does not exist." });
      }
      // console.log("User valid");

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        // console.log("Passwords invalid");
        // passwords do not match!
        return done(null, false, { error: "Invalid password." });
      }
      // console.log("Passwords valid");
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);
