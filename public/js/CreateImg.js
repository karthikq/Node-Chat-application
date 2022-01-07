/** @format */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-storage.js";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZj-GDrxCQNYouXLQFXO6Gzah21jzbPFE",
  authDomain: "chatapp-17824.firebaseapp.com",
  projectId: "chatapp-17824",
  storageBucket: "chatapp-17824.appspot.com",
  messagingSenderId: "154417328169",
  appId: "1:154417328169:web:8e78a6f563095f31c4ec38",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const opt = document.querySelector("#selectOpt");
const progessBar = document.querySelector("#progressbar");
const chatbox = document.querySelector(".chatbox");
const submitBtn = document.querySelector("#submitBtn");
const imageOpt = document.querySelector("#imgOpt");

const CreateImg = async (
  userInputValue,
  userId,
  room,
  userInput,
  socket,
  state
) => {
  submitBtn.setAttribute("disabled", true);
  submitBtn.innerHTML = "Uploading";
  console.log(opt.value);
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1000,
    useWebWorker: true,
  };

  try {
    const compFile = await imageCompression(userInputValue, options);

    state && chatbox.scrollTo(0, chatbox.scrollHeight);
    const storageRef = ref(storage, compFile.name);
    const uploadTask = uploadBytesResumable(storageRef, compFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        if (state) {
          progessBar.style.display = "block";
          submitBtn.setAttribute("disabled", true);
          submitBtn.textContent = "Uploading";
          progessBar.setAttribute("value", progress);
        }
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (state) {
            imageOpt.style.display = "block";
            imageOpt.setAttribute("src", downloadURL);
            submitBtn.removeAttribute("disabled");
            submitBtn.textContent = "Send";
            socket.emit("chatMessage", {
              userImg: downloadURL,
              userId: userId,
              room: room,
            });
            imageOpt.style.transform = "translateX(50%) scale(0.5)";
            setTimeout(() => {
              imageOpt.style.display = "none";
              progessBar.style.display = "none";
              userInput.value = "";
              userInput.focus();
            }, 100);
            chatbox.scrollTo(0, chatbox.scrollHeight);
          }
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export default CreateImg;
