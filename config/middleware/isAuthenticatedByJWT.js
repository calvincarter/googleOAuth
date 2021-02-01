// This is middleware for restricting routes a user is not allowed to visit if not logged in
const passport = require("passport");
const path = require("path");

module.exports = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user, info) => {
    if (error || !user) {
      console.log("UNAUTHORIZED", error, user, info);
      return res
        .status(401)
        .sendFile(path.join(__dirname, "../../public/index.html"));
    }
    req.user = user; // now that we have the user from jwt token, forward along request
    next();
  })(req, res, next);
};
