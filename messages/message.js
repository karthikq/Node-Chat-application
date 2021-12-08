/** @format */

const User = require("../models/User");
const Room = require("../models/Rooms");
const formatMessage = require("./formatMessage");

function message(io) {
  io.on("connection", (socket) => {
    // socket.emit("message", formatMessage(username, "Welcome to the chat"));
    socket.on("joinRoom", async ({ room, user }) => {
      //fetchUser

      const userDetails = await User.findOne({ userId: user });
      const roomExsits = await Room.findOne({ roomName: room });
      if (roomExsits) {
        const checkUser = roomExsits.users.find((userData) => {
          return userData.userId === user;
        });
        if (!checkUser) {
          await Room.findOneAndUpdate(
            {
              roomName: room,
            },
            {
              $push: {
                users: userDetails,
              },
            }
          );
        }

        socket.join(room);
      } else {
        const rooms = new Room({
          roomName: room,
          createdBy: userDetails.userId,
          users: userDetails,
        });
        await rooms.save();
        socket.join(room);
      }

      if (userDetails) {
        socket.broadcast
          .to(room)
          .emit(
            "message",
            formatMessage(
              userDetails.username,
              `${userDetails.username} joined the chat`
            )
          );
      }
      //user joined the chat
    });

    socket.on("chatMessage", async ({ userText, userImg, userId, room }) => {
      const RoomDetails = await Room.findOne({ roomName: room });
      const userDetails = await User.findOne({ userId });
      if (userDetails) {
        const userMessage = formatMessage(
          userDetails.username,
          userText,
          userImg
        );
        userMessage.userDetails = userDetails;

        await Room.findOneAndUpdate(
          { roomName: room },
          {
            $push: { chats: userMessage },
          }
        );
        if (RoomDetails.chats.length > 0) {
          const prevUserId =
            RoomDetails.chats[RoomDetails.chats.length - 1].userDetails.userId;
          userMessage.prevUserId = prevUserId;
        }
        io.to(room).emit("message", userMessage);
      }
    });
    //when user disconnects
    // socket.on("disconnect", () => {
    //   io.emit("message", formatMessage(username, "user disconnected"));
    // });
  });
}

module.exports = message;
