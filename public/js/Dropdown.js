/** @format */

const dotIcon = document.querySelectorAll(".dot-icon");
const dropdownChat = document.querySelectorAll(".dropdown-chat");
const chatdeleteitem = document.querySelectorAll(".chat-delete-item");
const chat_Id = document.querySelectorAll("#chat_Id");
const chat_room = document.querySelectorAll("#chat_room");
const statusSelect = document.getElementById("status-select");
const chatbox = document.querySelector(".chatbox");

const setStatus = document.querySelector(".set-status");
const chatInfo = document.querySelectorAll(".chat-info-item");

const { room, user, scroll } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const st = statusSelect.value;
const user1 = document.getElementById(user + 2);
if (st === "offline") {
  user1.style.backgroundColor = "red";
} else if (st === "active") {
  user1.style.backgroundColor = "rgb(5, 146, 47)";
} else if (st === "busy") {
  user1.style.backgroundColor = "black";
} else if (st === "gaming") {
  user1.style.backgroundColor = "white";
} else {
  user1.style.backgroundColor = "rgb(43, 3, 138)";
}

if (scroll) {
  window.location.href = "#" + scroll;

  setTimeout(() => {
    window.history.pushState({}, "", `/?room=${room}&user=${user}`);
  }, 2000);
} else {
  setTimeout(() => {
    chatbox.scrollTo({
      top: chatbox.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  }, 1000);
}
window.addEventListener("load", () => {
  dotIcon.forEach((icon, index) => {
    icon.addEventListener("click", (e) => {
      const checkactive = dropdownChat[index].classList.contains(
        "dropdown-chat-active"
      );
      console.log(icon);

      if (checkactive) {
        dropdownChat[index].classList.remove("dropdown-chat-active");
        // icon.setAttribute(
        //   "class",
        //   "fas fa-ellipsis-h dot-icon drop-icon-rotate"
        // );
      } else {
        // icon.setAttribute("class", "far fa-times-circle dot-icon circle-icon");
        dropdownChat[index].classList.add("dropdown-chat-active");

        setTimeout(() => {
          dropdownChat[index].classList.remove("dropdown-chat-active");
        }, 4000);
      }
    });
  });
  chatdeleteitem.forEach((item, index) => {
    item.addEventListener("click", async (e) => {
      const chatid = item.parentElement.children[0].value;
      // const prevchat = chat_Id[index - 1];
      const { data } = await axios.get(`/chat/prevchat/${chatid}?room=${room}`);

      // if (prevchat) {
      //   const prevchatid = prevchat.value;
      //   swalalert(chatid, prevchatid);
      // } else {
      const randomid = Math.floor(Math.random() * 4 + 1);
      swalalert(chatid, data);
      //  }
    });
  });
  chatInfo.forEach((item, index) => {
    item.addEventListener("click", async (e) => {
      const chatId = chat_Id[index].value;
      // const prevchat = chat_Id[index - 1];
      // console.log(item);
      // console.log(document.getElementById(chatId));
      // swalalert(chatId, prevchatid);
      const { data } = await axios.get(`/chat/details/${chatId}?room=${room}`);

      infoAlert(data);
    });
  });
});

function handleDots(chat) {
  const el = chat.children[1].classList.contains("dropdown-chat-active");

  if (el) {
    chat.children[1].classList.remove("dropdown-chat-active");
  } else {
    chat.children[1].classList.add("dropdown-chat-active");
    setTimeout(() => {
      chat.children[1].classList.remove("dropdown-chat-active");
    }, 4000);
  }
}
async function handleChatDelete(chat) {
  console.log(chat.children[1].children[0].value);
  const chatid = chat.children[1].children[0].value;
  const randomid = Math.floor(Math.random() * 4 + 1);
  const { data } = await axios.get(`/chat/prevchat/${chatid}?room=${room}`);

  swalalert(chatid, data);
  // const prevelement = document.querySelectorAll("#chat_Id");
  // const prevelIdexits = prevelement[prevelement.length - 2];
  // const currentId = prevelement[prevelement.length - 1].value;
  // if (prevelIdexits) {
  //   const prevelId = prevelIdexits.value;
  //   swalalert(currentId, prevelId);
  // } else {
  //   const randomid = Math.floor(Math.random() * 4 + 1);
  //   swalalert(currentId, randomid);
  // }
}
async function handleInfo(chat) {
  const chatId = chat.children[1].children[0].value;
  console.log(chat);
  const { data } = await axios.get(`/chat/details/${chatId}?room=${room}`);
  infoAlert(data);
}

function swalalert(chatid, prevchatid) {
  Swal.fire({
    icon: "error",

    text: "If you delete this message you can't retain it back",

    showCloseButton: true,
    showCancelButton: true,

    confirmButtonText: "Yes, delete it!",
    confirmButtonAriaLabel: "Delete chat",
    cancelButtonText: "cancel",
    cancelButtonAriaLabel: "cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      Swal.fire("Message deleted", "refreshing page", "success");
      await axios.delete(`/chat/delete/${chatid}?room=${room}`);
      window.location.href = `/?room=${room}&user=${user}&scroll=${prevchatid}`;
    } else if (result.isDenied) {
      Swal.fire("Message not deleted", "", "info");
    }
  });
}

async function handleStatuschange(userId) {
  const statusdata = { room, user, status: statusSelect.value };
  console.log(document.querySelector("#userchatId").value);
  const id = document.querySelector("#userchatId").value;
  const user1 = document.getElementById(id + 2);
  console.log(user1);

  // setuserStatus(statusdata.status);
  if (statusdata.status === "offline") {
    user1.style.backgroundColor = "red";
  } else if (statusdata.status === "active") {
    user1.style.backgroundColor = "rgb(5, 146, 47)";
  } else if (statusdata.status === "busy") {
    user1.style.backgroundColor = "black";
  } else if (statusdata.status === "gaming") {
    user1.style.backgroundColor = "white";
  } else {
    user1.style.backgroundColor = "rgb(43, 3, 138)";
  }
  axios.patch("/update/status", statusdata);
}

function infoAlert(data) {
  Swal.fire({
    title: data.userText,
    imageUrl: !data.userText && data.userImg,
    imageHeight: !data.userText && 220,
    imageWidth: !data.userText && 250,

    html:
      "By : <b>" +
      data.username +
      "</b>, <br/> " +
      "Userstatus : <b>" +
      data.userDetails.activeStatus +
      "</b> <br/> " +
      "ChatDuration :" +
      data.date,

    showClass: {
      popup: "animate__animated animate__fadeInUp animation-duration-0.8s",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutDown animation-duration-0.8s",
    },
  });
}
