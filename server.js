require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;
const passport = require("./config/passport");
const cookieParser = require("cookie-parser");
const db = require("./models");

// Sets up the Express app to handle data and cookie parsing.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev")); // using additional request logging in terminal
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

// Static directory
app.use(express.static("public"));

// Requiring our routes
require("./routes/oauth-routes.js")(app);
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log("App listening on PORT: " + PORT);
  });
});
