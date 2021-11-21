/** @format */
const port = process.env.PORT || 3000;
function CheckUser() {
  if (port === 3000) {
    return "http://localhost:3000";
  } else {
    return "https://chatroomapp1.herokuapp.com";
  }
}
module.exports = CheckUser;
