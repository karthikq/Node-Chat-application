/** @format */

const mongoose = require("mongoose");

async function Database() {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:user1234@cluster0.44gx5.mongodb.net/ChatApp"
    );
    console.log("Connected to Database");
  } catch (error) {
    console.log(error);
  }
}
module.exports = Database;
