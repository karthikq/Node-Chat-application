/** @format */

const express = require("express");
const User = require("../models/User");
const Room = require("../models/Rooms");
const route = express.Router();

route.get("/user/:id", async (req, res) => {
  const profileId = req.params.id;
  const userRooms = await Room.find({ createdBy: profileId });
  const checkUser = await User.findOne({ userId: profileId });

  if (req.user) {
    if (req.user.userId === profileId) {
      try {
        if (checkUser) {
          res.render("Profile", {
            userDetails: checkUser,
            userRooms,
            auth: true,
          });
        } else {
          res.render("Error", { room: "room", user: req.user.userId });
        }
      } catch (error) {
        res.render("Error", { room: "room", user: req.user.userId });
      }
    } else {
      if (checkUser) {
        res.render("Profile", {
          userDetails: checkUser,
          userRooms,
          auth: false,
        });
      }
    }
  } else {
    res.redirect("/?showlogin=true");
  }
});

route.patch("/user/update", async (req, res) => {
  const { userId, username, email, profileUrl } = req.body;

  const checkuserName = await User.findOne({ username: username });
  if (checkuserName) {
    return res.json({ usernameExists: true });
  }

  const findUser = await User.findOneAndUpdate(
    { userId },
    {
      $set: { username, email, profileUrl },
    },
    {
      new: true,
    }
  );

  await Room.updateMany(
    { "users.userId": userId },
    {
      $set: {
        "users.$.username": username,
        "users.$.email": email,
        "users.$.profileUrl": profileUrl,
      },
    }
  );

  await Room.updateMany(
    { "chats.userId": userId },
    {
      "chats.$[e].userDetails.username": username,
      "chats.$[e].userDetails.email": email,
      "chats.$[e].userDetails.profileUrl": profileUrl,
    },
    {
      arrayFilters: [{ "e.userDetails.userId": userId }],
    }
  );

  if (findUser) {
    res.json({ findUser, usernameExists: false });
  } else {
    console.log("S");
  }
});

module.exports = route;
