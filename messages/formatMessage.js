/** @format */
const moment = require("moment");
const { nanoid } = require("nanoid");
function formatMessage(username, userText, userImg) {
  return {
    username,
    userText: userText ? userText : "",
    userImg: userImg ? userImg : "",
    date: new Date().toLocaleTimeString(),
    time: moment().format("LT"),
    chatId: nanoid().replace("-", "").replace("_", ""),
  };
}
module.exports = formatMessage;
