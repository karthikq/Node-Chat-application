/** @format */

const mongoose = require("mongoose");

async function Database() {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:user1234@cluster0.44gx5.mongodb.net/ChatApp",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Connected to Database");
  } catch (error) {
    console.log(error, "net error");
  }
}
module.exports = Database;
