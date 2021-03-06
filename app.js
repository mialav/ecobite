require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bcrypt = require("bcrypt");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const User = require("./models/User");

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/ecobite", {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.use(
  session({
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// PASSPORT
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

app.use(passport.initialize());
app.use(passport.session());

const flash = require("connect-flash");
app.use(flash());

// PASSPORT SERIALIZE & DESERIALIZE
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(userDocument => {
      done(null, userDocument);
    })
    .catch(err => {
      done(err);
    });
});

// LOGIN AUTHENTICATION
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    (email, password, done) => {
      // Look for an existing user with the given email
      User.findOne({ email: email })
        .then(userDocument => {
          // If user doesn't exist, return error
          if (!userDocument) {
            done(null, false, { message: "Incorrect credentials" });
            return;
          }
          // Compare entered password with password associated with userDocument
          bcrypt.compare(password, userDocument.password).then(match => {
            // If doesn't match, return error
            if (!match) {
              done(null, false, { message: "Incorrect credentials" });
              return;
            }
            console.log(userDocument);
            // If user exists and password matches then log the user in
            done(null, userDocument);
          });
        })
        .catch(err => {
          done(err);
        });
    }
  )
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// REGISTER HANDLEBAR PARTIALS
hbs.registerPartials(__dirname + "/views/partials");

// REGISTER HANDLEBAR HELPERS
hbs.registerHelper("ifEquals", function(arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

// default value for title local
app.locals.title = "ecobite";

// middlewear to check for logged in user
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

const index = require("./routes/index");
app.use("/", index);

const restaurantRoutes = require("./routes/restaurants");
app.use("/", restaurantRoutes);

const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

const scoreRoutes = require("./routes/score");
app.use("/", scoreRoutes);

module.exports = app;
