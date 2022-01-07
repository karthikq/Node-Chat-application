/** @format */
import CreateImg from "./CreateImg.js";

const socket = io();

const chatform = document.getElementById("chatform");
const chatsContainer = document.querySelector(".chats");
const chatbox = document.querySelector(".chatbox");
const roomsDiv = document.querySelector(".rooms-list");
const icon = document.querySelector(".dropicon");
const roomsul = document.querySelectorAll("#rooms-ul li");
const loginBtn = document.querySelector("#loginbtn");
const loginFrom = document.querySelector(".auth-container");
const imageOpt = document.querySelector("#imgOpt");

const userIdValue = document.querySelector("#userIdValue");
const activeroom = document.querySelector(".active-room-s span");

const authValue = document.querySelector("#authValue");

const { room, user } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

window.addEventListener("load", () => {
  roomsul.forEach((element, index) => {
    if (element.children[0].innerHTML.trim() === room) {
      element.children[0].classList.add("a-active");
    } else {
      element.children[0].classList.add("a-main");
      element.children[0].classList.remove("a-active");
    }
  });
});

if (authValue.value === "false") {
  window.history.pushState = "/?showlogin=" + true;
} else {
  activeroom.style.display = "block";
  activeroom.innerHTML = `activeRoom : ${room}`;
  socket.emit("joinRoom", { room, user });
}

window.addEventListener("load", () => {
  chatform.addEventListener("submit", (e) => {
    e.preventDefault();
    const userId = e.target.elements[0].value;
    const userInput = e.target.elements[1];

    if (authValue.value === "false") {
      loginModal();
      window.history.pushState = "/?showlogin=" + true;
    } else {
      createChat(userId, userInput, imageOpt, room);
    }
  });
  socket.on("message", (msg) => {
    console.log(msg);

    outputMessage(msg);
  });
  icon.addEventListener("click", () => {
    if (roomsDiv.classList.contains("room-close")) {
      roomsDiv.classList.remove("room-close");
      roomsDiv.classList.add("room-open");
      icon.classList.add("fahover");
      // roomsDiv.parentElement.children[2].style.bottom = 0;
    } else {
      icon.classList.remove("fahover");
      roomsDiv.classList.add("room-close");
      roomsDiv.classList.remove("room-open");
      // roomsDiv.parentElement.children[2].style.bottom = "10rem";
    }
  });
});
async function createChat(userId, userInput, imageOpt, room) {
  const userInputValue = userInput.value;
  const type = userInput.type;

  if (type === "file") {
    const imageFile = userInput.files[0];
    await CreateImg(imageFile, userId, room, userInput, socket, true);
  } else {
    if (userInput) {
      socket.emit("chatMessage", {
        userText: userInputValue,
        userId: userId,
        room: room,
      });
      userInput.value = "";
      userInput.focus();
    }
  }
}

function loginModal() {
  loginFrom.style.display = "block";
}
loginBtn.addEventListener("click", (e) => {
  loginModal();
});
loginFrom.addEventListener("click", (e) => {
  console.log(e.target.contains(loginFrom.children[0]));
  const contains = e.target.contains(loginFrom.children[0]);
  if (contains) {
    loginFrom.style.display = "none";
  } else {
    loginFrom.style.display = "block";
  }
});
function outputMessage(msg) {
  // console.log(msg.prevUserId, msg.userDetails.userId);
  if (msg.prevUserId && msg.prevUserId === msg.userDetails.userId) {
    // const userList = document.querySelectorAll("#" + msg.prevUserId);

    const div = document.createElement("div");

    if (userIdValue.value === msg.userDetails.userId) {
      div.classList.add("chat-item", "user-chat-list");
      opData(div, true);
    } else {
      div.classList.add(
        "chat-item",
        "chats-left",
        "user-chat-list",
        "left-align",
        "left-margin-p"
      );
      opData(div, false);
    }
    function opData(div, va) {
      if (msg.userText) {
        const item = `<div class="chatdetails" >
                        <div class="${
                          va ? "chat-dots" : "chat-dots chat-dots-left"
                        }" id=${msg.chatId.toString()}>
                        <i onclick="handleDots(${msg.chatId.toString()})" class="${
          va
            ? "fas fa-ellipsis-h dot-icon drop-icon-rotate"
            : "fas fa-ellipsis-h dot-icon dot-icon-left-rotate"
        }"></i>
                        <div class="${
                          va
                            ? "dropdown-chat"
                            : "dropdown-chat dropdown-chat-left"
                        }">
                        <input type="hidden" value=${msg.chatId} id="chat_Id" >
                        
                         ${
                           va
                             ? `<span onclick="handleChatDelete(${msg.chatId.toString()})"  class="dropdown-item chat-delete-item">Delete</span>`
                             : ""
                         }
                         <span style="text-align: center;" class="dropdown-item" onclick="handleInfo(${msg.chatId.toString()})">Information</span> 
                        
                       </div>
                      </div>
                     <p>${msg.userText}</p>
                     </div>`;
        div.innerHTML = item;

        chatsContainer.appendChild(div);
        // chatsContainer.scrollTop = chatsContainer.scrollHeight + "40";
        chatbox.scrollTo({
          top: chatbox.scrollHeight,
          left: 0,
          behavior: "smooth",
        });
      } else {
        const item = `<div class="chatdetails" style="margin: 1rem 0" >
                       <div class="chat-dots" id=${msg.chatId.toString()}>
                       <i  onclick="handleDots(${msg.chatId.toString()})" class="fas fa-ellipsis-h dot-icon drop-icon-rotate"></i>
                       <div class="dropdown-chat">
                       <input type="hidden" value=${msg.chatId} id="chat_Id" >

                        <span onclick="handleChatDelete(${msg.chatId.toString()})" class="dropdown-item chat-delete-item"  >Delete</span>
                         <span class="dropdown-item" onclick="handleInfo(${msg.chatId.toString()})">Information</span>
                       </div>
                     </div>
                       <div class="chat-imgbox" >
                         <img src=${
                           msg.userImg
                         } alt="error" class="image-chat" />
                          <div class="chat-imgdownload">
                          <a download=${msg.userImg} href=${
          msg.userImg
        } target="_blank" rel="noreferrer">
                           <i class="fas fa-cloud-download-alt download-icon"></i>
                          </a>
                         </div>
                        </div>
                      </div>`;
        div.innerHTML = item;

        chatsContainer.appendChild(div);
        chatbox.scrollTo({
          top: chatbox.scrollHeight,
          left: 0,
          behavior: "smooth",
        });
      }
    }
  } else {
    const div = document.createElement("div");
    console.log(userIdValue.value, msg.userDetails.userId);
    if (userIdValue.value === msg.userDetails.userId) {
      div.classList.add("chat-item", "user-chat-list", "right-margin");
      outputHtml(true);
    } else {
      div.classList.add(
        "chat-item",
        "chats-left",
        "user-chat-list",
        "left-align",
        "left-margin"
      );
      outputHtml(false);
    }
    function outputHtml(va) {
      div.innerHTML = `<div class="chatdetails" id=${msg.userDetails.userId}> 
                        <div class="chat-dots" id=${msg.chatId}>
                         <i  onclick="handleDots(${
                           msg.chatId
                         })"  class="fas fa-ellipsis-h dot-icon"></i>
                         <div style="${
                           !va && "right: 0;"
                         }" class="dropdown-chat">
                         <input type="hidden" value=${msg.chatId} id="chat_Id" >
                        
                          ${
                            va
                              ? `<span onclick="handleChatDelete(${msg.chatId})"  class="dropdown-item chat-delete-item">Delete</span>`
                              : ""
                          }
                            <span style="text-align: center;" class="dropdown-item" onclick="handleInfo(${
                              msg.chatId
                            })">Information</span> 
                         
                          
                        </div>
                       </div>
                      <div class="chat-user-details" >
                     <img src =${
                       msg.userDetails.profileUrl
                     } alt="profile Url" class="profile-img" >
                      <span class="user-name" >${msg.username}</span>
                      <span class="user-date" >${msg.date}</span>
                     </div>
                    ${msg.userText && `<p class="no-bg">${msg.userText}</p>`}
                     ${
                       msg.userImg &&
                       `<div class="chat-imgbox" >
                        <img src=${msg.userImg} alt="error" class="image-chat" /> 
                        <div class="chat-imgdownload">
                         <a download=${msg.userImg} href=${msg.userImg} target="_blank" rel="noreferrer">
                         <i class="fas fa-cloud-download-alt download-icon"></i>
                        </a>
                       </div>

                     </div>
    `
                     }
  </div>`;
      chatsContainer.appendChild(div);

      chatbox.scrollTo({
        top: chatbox.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  }
}
