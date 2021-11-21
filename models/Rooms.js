/** @format */

const mongoose = require("mongoose");
const User = require("./User");

const roomSchema = new mongoose.Schema({
  roomName: String,
  users: [{ userName: String, userId: String }],
  chats: [
    {
      userText: String,
      userImg: String,
      date: String,
      time: String,
      username: String,
      userDetails: {},
    },
  ],
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
