/** @format */

const mongoose = require("mongoose");
const User = require("./User");

const roomSchema = new mongoose.Schema({
  roomName: String,
  createdBy: String,
  users: [],
  chats: [
    {
      chatId: String,
      userText: String,
      userImg: String,
      date: String,
      time: String,
      username: String,
      userId: String,
      userDetails: {},
    },
  ],
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
