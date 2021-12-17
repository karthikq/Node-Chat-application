/** @format */

const express = require("express");
const passport = require("passport");
const GoogleAuth = require("../auth/GoogleAuth");

const route = express.Router();

GoogleAuth(passport);

route.get(
  "/user/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

route.get("/user/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/user/room");
});
route.get("/user/logout", (req, res) => {
  req.logout();
  res.redirect("/?showlogin=" + true);
});

route.get(
  "/user/github",
  passport.authenticate("github", { scope: "user:email" })
);
route.get("/github/callback", passport.authenticate("github"), (req, res) => {
  res.redirect("/user/room");
});
module.exports = route;
