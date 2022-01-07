/** @format */

const express = require("express");
const User = require("../models/User");
const Room = require("../models/Rooms");
const route = express.Router();

route.get("/user/:id", async (req, res) => {
  const profileId = req.params.id;

  try {
    const checkUser = await User.findOne({ userId: profileId });
    const userRooms = await Room.find({ createdBy: profileId });

    if (checkUser) {
      res.render("Profile", { userDetails: checkUser, userRooms });
    } else {
      res.render("Error");
    }
  } catch (error) {
    res.render("Error");
  }
});

module.exports = route;
