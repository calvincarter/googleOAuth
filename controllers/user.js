const db = require("../models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];

/*
  Registered claims: These are a set of predefined claims which are not mandatory but recommended, to provide a set of useful, interoperable claims. Some of them are: 
    iss (issuer), - claim identifies the principal that issued the JWT.
    sub (subject), - claim identifies the principal that is the subject of the JWT. We"ll use the email provided by Google.
    iat (issued at) - claim identifies the time at which the JWT was issued.
    aud (audience) - claim identifies the recipients that the JWT is intended for.
    exp (expiration time) - claim identifies the expiration time on or after which the JWT MUST NOT be accepted for processing.
*/

signToken = (user) => {
  return jwt.sign(
    {
      iss: config.jwt.issuer,
      sub: user.providerId,
      iat: new Date().getTime(),
      aud: user.email,
      exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead when token will expire
      // The exp is not fully functional. If you need to constantly get new tokens from Google,
      // you will have to check Google docs on when token actually expires
    },
    config.jwt.secret
  );
};

module.exports = {
  findAll: async () => {
    return await db.User.findAll();
  },
  findByProviderId: async (providerId) => {
    return await db.User.findOne({
      where: {
        providerId: {
          [Op.eq]: providerId,
        },
      },
    });
  },
  create: async (newUser) => {
    return await db.User.create(newUser);
  },
  googleOauth: async (user) => {
    return await signToken(user);
  },
};
