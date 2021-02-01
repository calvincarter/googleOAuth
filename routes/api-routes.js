const isAuthenticatedByJWT = require("../config/middleware/isAuthenticatedByJWT.js");

module.exports = function (app) {
  // Route for getting some data about our user to be used client side
  /* Note the passport.authenticate('jwt') will run 1st and validate users JWT before giving access to user information */
  app.post("/api/user_data", (req, res) => {

    req.body.email
    req.body.image
    req.body.name

    if(email) {
      then navigate user inside our app
    } else { // the user doesn't exist
      create user in Db
      then navigate user inside our app
    }

    res.json({
      email: req.user.email,
      id: req.user.id,
    });
  });
};
