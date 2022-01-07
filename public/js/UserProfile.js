/** @format */

const profilepic = document.querySelector(".profile-span");
const uploadcancel = document.querySelector(".upload-cancel");
const uploadContent = document.querySelector(".profile-upload-form");
const profilechange = document.querySelector("#profilechange");
const profileForm = document.querySelector(".profile-form");

profilepic.addEventListener("click", (e) => {
  changeWidth(100, 100, "visible", 0, "none", "visible");
});
uploadcancel.addEventListener("click", () => {
  changeWidth(0, 0, "hidden", -100, "block", "hidden");
});

function changeWidth(w, h, o, t, d, c) {
  uploadContent.style.visibility = o;
  uploadContent.style.width = w + "%";
  uploadContent.style.height = h + "%";
  uploadContent.style.transform = `translateX(${t}%)`;
  profilepic.style.display = d;
  uploadcancel.style.visibility = c;
}

profileForm.addEventListener("submit", async () => {
  const newprofileImg = profilechange.value;
  console.log(newprofileImg);
  await
});
