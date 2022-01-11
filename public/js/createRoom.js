/** @format */

const createForm = document.querySelector("#createFormContainer");
const createRoomBtn = document.querySelector("#createRoomBtn");
const closeIcon = document.querySelector("#closeIcon");
const createForm2 = document.querySelector("#createForm");
const createSubmitBtn = document.querySelector("#createSubmitBtn");
const createformerror = document.querySelector(".createformerror");
const loginFrom = document.querySelector(".auth-container");

// const { room, user } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });

function loginModal2() {
  loginFrom.style.display = "block";
}
createRoomBtn.addEventListener("click", () => {
  if (authValue.value === "false") {
    loginModal2();
    window.history.pushState = "/?showlogin=" + true;
  } else {
    createForm.style.display = "flex";
  }
});

closeIcon.addEventListener("click", () => {
  createForm.style.display = "none";
});

createForm2.addEventListener("submit", async (e) => {
  e.preventDefault();

  const roomName = e.target.elements[0].value;
  createSubmitBtn.innerHTML = "Creating Room";
  if (authValue.value === "false") {
    loginModal2();

    window.history.pushState = "/?showlogin=" + true;
    createSubmitBtn.innerHTML = "Create";
  } else {
    try {
      const { data } = await axios.post("/room/create", {
        roomName,
        user: userIdValue.value,
      });
      if (data) {
        if (data.errorStatus) {
          createformerror.style.display = "inline-block";
          createformerror.innerHTML = data.message;
        } else {
          createformerror.style.display = "none";
          createformerror.innerHTML = data.message;
          window.location.href = `/?room=${data.roomName}&user=${userIdValue.value}`;
        }
      }

      createSubmitBtn.innerHTML = "Create";
    } catch (error) {
      console.log(error);
    }
  }
});
