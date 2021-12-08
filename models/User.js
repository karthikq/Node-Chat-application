/** @format */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  GoogleId: String,
  username: String,
  profileUrl: String,
  email: String,
  userId: String,
  activeStatus: {
    type: String,
    default: "active",
  },
  chats: [
    {
      chatId: String,
      userText: String,
      userImg: String,
      date: String,
      username: String,
      profileUrl: String,
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
