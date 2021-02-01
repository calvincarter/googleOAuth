const passport = require("passport");
const path = require("path");
const userController = require("../controllers/user");

const passportGoogle = (req, res) => {
  passport.authenticate("google", { session: false }, (error, user, info) => {
    if (error || !user) {
      console.log("error", error);
      console.log("info", info);
      return res
        .status(401)
        .sendFile(path.join(__dirname, "../public/index.html"));
    }

    userController.googleOauth(user).then((token) => {
      // Successfully authenticated!
      // Store the generated jwt in the client cookie
      console.log("successfully authenticated");
      res.cookie("jwt", token, { httpOnly: true }); // httpOnly will disable javascript from modifying cookie in browser
      res.redirect("/members");
    });
  })(req, res);
};

module.exports = function (app) {
  // Redirect the user to Google for authentication.  When complete,
  // Google will redirect the user back to the application at => /oauth/google/callback
  app.get("/oauth/google", passportGoogle);

  // Google will redirect the user to this URL after approval.  Finish the
  // authentication process by attempting to obtain an access token.  If
  // access was granted, the user will be logged in.  Otherwise,
  // authentication has failed.
  app.get("/oauth/google/callback", passportGoogle);

  app.get("/oauth/logout", (req, res) => {
    console.log("logging user out");
    res.clearCookie("jwt");
    res.redirect("/");
  });
};
