const isAuthenticatedByJWT = require("../config/middleware/isAuthenticatedByJWT.js");

module.exports = function (app) {
  // Route for getting some data about our user to be used client side
  /* Note the passport.authenticate('jwt') will run 1st and validate users JWT before giving access to user information */
  app.get("/api/user_data", isAuthenticatedByJWT, (req, res) => {
    res.json({
      email: req.user.email,
      id: req.user.id,
    });
  });
};
