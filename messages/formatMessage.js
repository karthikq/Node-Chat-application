/** @format */
const moment = require("moment");
function formatMessage(username, userText, userImg) {
  return {
    username,
    userText: userText ? userText : "",
    userImg: userImg ? userImg : "",
    date: new Date().toLocaleTimeString(),
    time: moment().format("LT"),
  };
}
module.exports = formatMessage;
