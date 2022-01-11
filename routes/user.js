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
    const AvlRooms = await Room.find({});
    const checkRoom = await Room.findOne({ roomName: room });
    if (!room) {
      res.redirect(`/?room=public&user=${req.query.user}`);
    } else {
      if (!checkRoom) {
        res.render("Error", { room, user: req.user.userId });
      } else {
        const chatDetails = await Room.findOne({ roomName: room });

        if (chatDetails) {
          res.render("home", {
            details: userDetails,
            chats: chatDetails.chats,
            chatusers: chatDetails.users,
            auth: true,
            AvlRooms,
          });
        } else {
          res.render("Error");
        }
      }
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
  const { roomName, user } = req.body;

  const name = roomName.replace(/\s/g, "").toLowerCase();

  try {
    const checkRoom = await Room.findOne({ roomName: name });
    const userDetails = await User.findOne({ userId: user });

    if (checkRoom) {
      res
        .status(200)
        .json({ message: "room already exists", errorStatus: true });
    } else {
      const newRoom = new Room({
        roomName: name,
        createdBy: user,
        users: userDetails,
      });
      await newRoom.save();
      // const AvlRooms = await Room.find({});

      return res
        .status(200)
        .json({ message: "Creating room", errorStatus: false, roomName: name });
    }
  } catch (error) {
    console.log(error);
  }
});

route.delete("/chat/delete/:id", async (req, res) => {
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
  await Room.updateMany(
    { "chats.$[].userDetails.userId": updateUser.userId },
    {
      $set: { "chats.$[].userDetails.activeStatus": status },
    }
  );
  res.json(updateChatuser);
});

route.get("/chat/details/:id", async (req, res) => {
  const chatid = req.params.id;
  const room = req.query.room;

  const findRoom = await Room.findOne({ roomName: room });
  if (findRoom) {
    const chat = findRoom.chats.find((item) => item.chatId === chatid);
    res.json(chat);
  } else {
    res.status(404).send("no chat found");
  }
});
route.get("/chat/prevchat/:id", async (req, res) => {
  const id = req.params.id;
  const room = req.query.room;

  const findprevChat = await Room.findOne({
    roomName: room,
    "chats.chatId": id,
  });

  const index = findprevChat.chats.findIndex(
    (item, index) => item.chatId === id
  );
  const prevChatId = findprevChat.chats[index - 1];

  if (prevChatId) {
    res.json(prevChatId.chatId);
  } else {
    res.json("#1");
  }
});

module.exports = route;
