/** @format */
// import { UploadFile } from "../js/Upload.js";
import CreateImg from "./CreateImg.js";

const profilepic = document.querySelector(".profile-span");
const uploadcancel = document.querySelector(".upload-cancel");
const uploadContent = document.querySelector(".profile-upload-form");
const profilechange = document.querySelector("#profilechange");
const profileForm = document.querySelector(".profile-form");
const profilebodytext = document.querySelector(".profile-body-text-span");
const profileErr = document.querySelector(".profile-err");

const profileUploadedImg = document.querySelector(".profile-uploaded-img");
const profileImgEditIcon = document.querySelector(".profile-img-edit-icon");
const profileUploadcancel = document.querySelector(".profile-upload-cancel");
const profileUsername = document.querySelector("#profileUsername");
const profileEmail = document.querySelector("#profileEmail");

const userProfileImg = document.getElementById("userProfile");
const userId = document.querySelector("#loggeduserId").value;
const toasts = document.querySelector(".toasts");

profilepic.addEventListener("click", (e) => {
  changeWidth(100, 100, "visible", 0, "none", "visible");
});
uploadcancel.addEventListener("click", () => {
  changeWidth(0, 0, "hidden", -100, "block", "hidden");

  const profileUrl = userProfileImg.getAttribute("data-value");

  profileUploadedImg.style.display = "flex";
  profilechange.style.display = "none";
  profileUploadcancel.style.visibility = "hidden";
  userProfileImg.setAttribute("src", profileUrl);

  const value = profileUploadedImg.classList.contains("edit-profileimg");
  if (value) profileUploadedImg.classList.remove("edit-profileimg");
});

function changeWidth(w, h, o, t, d, c) {
  uploadContent.style.visibility = o;
  uploadContent.style.width = w + "%";
  uploadContent.style.height = h === 0 ? 0 : h + "%";
  uploadContent.style.transform = `translateX(${t}%)`;
  profilepic.style.display = d;
  uploadcancel.style.visibility = c;
}

profilechange.style.display = "none";

profilechange.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const createObjectUrl = URL.createObjectURL(file);
  userProfileImg.setAttribute("src", createObjectUrl);
});

function updateData(url) {
  toasts.children[0].innerHTML = "Saving data please wait";
  if (url) {
    updateValue(url);
  }
}

profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newprofileImg = profilechange.files[0];
  const userImage = userProfileImg.getAttribute("src");
  const PrevprofileUrl = userProfileImg.getAttribute("data-value");

  profileErr.style.display = "none";

  if (userImage === PrevprofileUrl) {
    const value = profileUploadedImg.classList.contains("edit-profileimg");
    if (value) {
      if (!newprofileImg) {
        return profilechange.setAttribute("required", true);
      }
    } else {
      updateValue(PrevprofileUrl);
    }
  } else {
    toasts.style.display = "flex";
    toasts.children[0].innerHTML = "Uploading Image please wait";
    await CreateImg(
      newprofileImg,
      userId,
      updateData,
      "userInput",
      "socket",
      false
    );
  }
});

profileImgEditIcon.addEventListener("click", () => {
  profileUploadedImg.classList.add("edit-profileimg");
  profileUploadedImg.style.display = "none";
  profilechange.style.display = "block";
  profileUploadcancel.style.visibility = "visible";
});

async function updateValue(profileUrl) {
  const username = profileUsername.value;
  const email = profileEmail.value;

  if (profilebodytext.innerHTML !== username) {
    profilebodytext.innerHTML = "Updating...";
  }

  toasts.style.display = "flex";
  try {
    const { data } = await axios.patch(
      "/profile/user/update",
      { username, email, profileUrl, userId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (data) {
      if (data.usernameExists) {
        profileErr.style.display = "block";
        toasts.children[0].innerHTML = "Username already exists!";
      } else {
        profileErr.style.display = "none";

        profilebodytext.innerHTML = data.username;
        toasts.children[0].innerHTML = "Data saved";
        setTimeout(() => {
          toasts.classList.add("transform-toast");
        }, 2000);
        setTimeout(() => {
          toasts.classList.remove("transform-toast");
          toasts.style.display = "none";
          window.location.reload();
        }, 3000);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
profileUploadcancel.addEventListener("click", () => {
  profileUploadedImg.classList.remove("edit-profileimg");
  profileUploadedImg.style.display = "flex";
  profilechange.style.display = "none";
  profileUploadcancel.style.visibility = "hidden";
});
