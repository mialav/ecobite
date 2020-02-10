const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Score = require("../models/Score");

// SIGN UP WITH EMAIL ADDRESS
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    res.render("signup.hbs", {
      errorMessage: "Email cannot be empty"
    });
    return;
  }
  if (password.length < 8) {
    res.render("signup.hbs", {
      errorMessage: "Password must be at least 8 characters."
    });
    return;
  }

  // User.findOne({ email });
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        res.render("signup.hbs", {
          errorMessage: "Email already taken"
        });
        return;
      }

      bcrypt
        .hash(password, 10)
        .then(hash => {
          return User.create({ email: email, password: hash });
        })
        .then(createdUser => {
          console.log(createdUser);

          // req.user = createdUser;
          req.login(createdUser, err => {
            if (err) {
              next(err);
              return;
            }
            res.redirect("/");
          });
        });
      // User.create({ email: email, password: password });
    })
    .catch(err => {
      next(err);
    });
});

// let info = zxcvbn(password);
// if (info.score < 3) {
//   res.render("signup", { errorMessage: info.feedback.suggestions[0] });
//   return;
// }

module.exports = router;
