/** @format */
console.log("S");
const roomdeleteBtn = document.querySelectorAll(".room-delete");

const userId = document.querySelector("#loggeduserId").value;
console.log(userId);
window.addEventListener("load", () => {
  roomdeleteBtn.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const getRoomName = roomdeleteBtn[index].getAttribute("data-value");

      Swal.fire({
        title: `Do you want to delete room ${getRoomName}?`,

        showCancelButton: true,
        confirmButtonText: "Delete",
        confirmButtonColor: "#d33",
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const resp = await axios.delete(
            `/room/delete/${getRoomName}/?user=${userId}`
          );
          if (resp.data.status) {
            Swal.fire("Room deleted", "refreshing page", "success");
            window.location.reload();
          } else {
            Swal.fire({
              icon: "error",
              title: "Room Not found",
              text: "Please refresh page and try again",
            });
          }
          // Swal.fire("Saved!", "", "success");
        }
      });
    });
  });
});

function swal(getRoomName) {}
