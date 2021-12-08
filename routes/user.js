/** @format */

const express = require("express");
const Room = require("../models/Rooms");
const User = require("../models/User");

const route = express.Router();

route.get("/", async (req, res) => {
  const { room, user } = req.query;

  if (req.user) {
    const userDetails = await User.findOne({
      userId: req.user.userId,
    });

    const chatDetails = await Room.findOne({ roomName: room });
    const AvlRooms = await Room.find({});

    if (chatDetails) {
      res.render("home", {
        details: userDetails,
        chats: chatDetails.chats,
        chatusers: chatDetails.users,
        auth: true,
        AvlRooms,
      });
    } else {
      const newRoom = new Room({
        roomName: room,
        createBy: userDetails.userId,
        users: userDetails,
      });
      await newRoom.save();
      const AvlRooms = await Room.find({});

      res.render("home", {
        details: userDetails,
        chats: newRoom.chats,
        AvlRooms,
        auth: true,
      });
    }
  } else {
    res.render("home", { auth: false, chats: [] });
  }
});

route.get("/room", async (req, res) => {
  res.redirect(`/?room=${req.query.roomName}&user=${req.query.user}`);
});

route.get("/user/room", async (req, res) => {
  if (req.user) {
    const AvlRooms = await Room.find({});
    res.render("intro", { userId: req.user.userId, AvlRooms });
  } else {
    res.redirect("/?showlogin=" + true);
  }
});

route.post("/user/room", (req, res) => {
  const { room } = req.body;
  res.redirect(`/?room=${room}&user=${req.query.userId}`);
});

route.post("/room/create", async (req, res) => {
  const { roomName } = req.body;

  const name = roomName.replace(/\s/g, "").toLowerCase();

  const checkRoom = await Room.findOne({ roomName: name });
  if (checkRoom) {
    res.status(200).json({ message: "room already exists", errorStatus: true });
    console.log("s");
  } else {
    res.status(200).json({ message: "room doesn't exist", errorStatus: false });
  }
});

route.delete("/chat/delete/:id", async (req, res) => {
  console.log(req.query.room);
  const chatid = req.params.id;
  const chatroom = req.query.room;
  const deletedChat = await Room.findOneAndUpdate(
    { roomName: chatroom },
    {
      $pull: { chats: { chatId: chatid } },
    },
    {
      new: true,
    }
  );

  res.json(deletedChat);
});
route.patch("/update/status", async (req, res) => {
  console.log(req.body);
  const { user, room, status } = req.body;
  const updateUser = await User.findOneAndUpdate(
    { userId: user },
    {
      $set: { activeStatus: status },
    },
    {
      new: true,
    }
  );
  const updateChatuser = await Room.findOneAndUpdate(
    { "users.userId": user },
    {
      $set: { "users.$.activeStatus": status },
    },
    {
      new: true,
    }
  );
  res.json(updateChatuser);
});
module.exports = route;
