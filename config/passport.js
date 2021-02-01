const env = process.env.NODE_ENV || "development";
const config = require("./config.js")[env];
const userController = require("../controllers/user");
const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const GoogleStrategy = require("passport-google-oauth20");

const jwtOptions = {};

passport.use(
  new GoogleStrategy(
    config.google,
    async (accessToken, refreshToken, params, profile, done) => {
      // We are attempting to do the following
      // 1) Find a user in the db using profile.id
      // 2) If the user is found, return the data using the done() callback
      // 3) Otherwise the user is not found, create new user in the db, and return the data using the done() callback

      try {
        //console.log("profile",profile);
        //console.log("params", params);
        // console.log("accessToken", accessToken);
        // console.log("refreshToken", refreshToken);

        // Find a user in the db using profile.id
        const existingUser = await userController.findByProviderId(profile.id);

        // If the user is found, return the data using the done() callback
        if (existingUser) {
          console.log("user already exist in database");
          return done(null, existingUser);
        }

        // Otherwise, the user is not found, create new user in the db, and return the data using the done() callback
        const newUser = {
          provider: "google",
          providerId: profile.id,
          name: profile.displayName || "",
          email: profile.emails[0].value || "",
          profilePicture: profile.photos[0].value || "",
        };

        console.log("user doesn't exist in database, creating new one");
        done(null, await userController.create(newUser));
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

jwtOptions.secretOrKey = config.jwt.secret;
jwtOptions.issuer = config.jwt.issuer;
jwtOptions.jwtFromRequest = jwtOptions.jwtFromRequest = function (req) {
  if (req && req.headers.authorization) {
    /*
      If client decides to send request in headers, retrieve JSON Web Token (JWT) from Authorization header.
      Request in header will be as a Bearer JSON Web Token (JWT).
        e.g. "Bearer 13ag4.39234adfbb.2943924ggqr"
      
      To get just the token we must split on the first space and grab everything that's on the right. 
      We want to everything in string except "Bearer".

        e.g. "13ag4.39234adfbb.2943924ggqr"
    */
    return req.headers.authorization.split(" ")[1];
  } else if (req && req.cookies) {
    /*
      Authorization header is good for API and mobile support, however lets use cookies to avoid constant
      maintenance of Authorization header. If the client sent a request in the broswer, then this app
      supports cookies as well and the JWT is stored in it. See oauth-routes.js file res.cookie("jwt")
    */
    return req.cookies.jwt;
  }
  return null;
};

passport.use(
  new JWTStrategy(jwtOptions, async (payload, done) => {
    try {
      // Find the user specified in token
      const user = await userController.findByProviderId(payload.sub);

      // If user doesn't exist, INVALIDATE
      if (!user) {
        return done(null, false);
      }

      // Otherwise, return the user
      done(null, user);
    } catch (error) {
      done(error, false, error.message);
    }
  })
);

// Exporting our configured passport
module.exports = passport;
