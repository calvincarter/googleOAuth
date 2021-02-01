// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const isAuthenticatedByJWT = require("../config/middleware/isAuthenticatedByJWT.js");

module.exports = function (app) {
  app.get("/members", isAuthenticatedByJWT, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
};
