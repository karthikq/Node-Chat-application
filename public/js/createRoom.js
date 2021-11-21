/** @format */

const createForm = document.querySelector("#createFormContainer");
const createRoomBtn = document.querySelector("#createRoomBtn");
const closeIcon = document.querySelector("#closeIcon");
const createForm2 = document.querySelector("#createForm");
const createSubmitBtn = document.querySelector("#createSubmitBtn");
const createformerror = document.querySelector(".createformerror");

createRoomBtn.addEventListener("click", () => {
  if (authValue.value === "false") {
    loginModal();
    window.history.pushState = "/?showlogin=" + true;
  } else createForm.style.display = "flex";
});

closeIcon.addEventListener("click", () => {
  createForm.style.display = "none";
});

createForm2.addEventListener("submit", async (e) => {
  e.preventDefault();

  const roomName = e.target.elements[0].value;

  if (authValue.value === "false") {
    loginModal();
    window.history.pushState = "/?showlogin=" + true;
  } else {
    try {
      const { data } = await axios.post("/room/create", { roomName });

      if (data.errorStatus) {
        createformerror.style.display = "inline-block";
        createformerror.innerHTML = data.message;
      } else {
        createformerror.style.display = "none";
        createformerror.innerHTML = data.message;
        window.location.href = `/?room=${roomName.replace(/\s/g, "")}&user=${
          userIdValue.value
        }`;
      }
    } catch (error) {
      console.log(error);
    }
  }
});
