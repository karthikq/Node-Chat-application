/** @format */

const opt = document.querySelector("#selectOpt");
const inputopt = document.querySelector("#inputOpt");
const imageOpt = document.querySelector("#imgOpt");
const progessBar = document.querySelector("#progressbar");
const submitBtn = document.querySelector("#submitBtn");
const chatbox = document.querySelector(".chatbox");

if (inputopt.type === "file") {
  progessBar.style.display = "block";
  imageOpt.style.display = "block";
} else {
  progessBar.style.display = "none";
  imageOpt.style.display = "none";
}
inputopt.addEventListener("change", async (e) => {
  if (inputopt.type === "file") {
    imageOpt.style.transform = "translateX(0%) scale(1)";
    imageOpt.style.display = "block";
    const src = URL.createObjectURL(e.target.files[0]);
    imageOpt.setAttribute("src", src);
  } else {
    progessBar.style.display = "none";
    imageOpt.style.display = "none";
  }
});

opt.addEventListener("change", () => {
  inputopt.type = opt.value;
  if (inputopt.type === "file") {
    inputopt.accept = ".jpg, .png, .webp, .jpeg";
    inputopt.style.color = "white";
  } else {
    progessBar.style.display = "none";
    imageOpt.style.display = "none";
    inputopt.accept = "";
    inputopt.style.color = "white";
  }
});
