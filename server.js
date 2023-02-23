/** @format */

require("dotenv").config();
const express = require("express");
const http = require("http");
const port = process.env.PORT || 3000;
const socketio = require("socket.io");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
require("ejs");

const Database = require("./connection/database");
const message = require("./messages/message");
const GoogleAuth = require("./auth/GoogleAuth");
const GithubAuth = require("./auth/GithubAuth");
const path = require("path");
Database();

const app = express();
const server = http.createServer(app);

GoogleAuth(passport);
GithubAuth(passport);

app.use(cors());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "value",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const io = socketio(server);
message(io);

app.use("/", require("./routes/user"));
app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));

server.listen(port, () => {
  console.log("server running at port " + port);
});
