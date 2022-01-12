/** @format */

const roomdeleteBtn = document.querySelectorAll(".room-delete");
const profileimg = document.querySelector(".img-header");

const userId = document.querySelector("#loggeduserId").value;
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

const imagesArray = [
  {
    url: "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    url: "https://images.pexels.com/photos/2775196/pexels-photo-2775196.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    url: "https://images.pexels.com/photos/2356059/pexels-photo-2356059.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    url: "https://images.pexels.com/photos/6439051/pexels-photo-6439051.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    url: "https://images.pexels.com/photos/4932184/pexels-photo-4932184.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    url: "https://images.pexels.com/photos/1769734/pexels-photo-1769734.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
];

window.addEventListener("load", () => {
  const randomeNumber = Math.floor(Math.random() * imagesArray.length);
  const randomImg = imagesArray[randomeNumber];

  profileimg.setAttribute("src", randomImg.url);
});
