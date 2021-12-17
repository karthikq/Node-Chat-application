/** @format */
const sidebar = document.querySelector(".sidebar");
const sidebarmenu = document.querySelector(".sidebar-menu");
const sidebarrigntmobile = document.querySelector(".sidebar-rignt-mobile");
const sidebarright = document.querySelector(".sidebar-right");
const mobileavatar = document.querySelector("#mobile-avatar");

function handleNavMenu() {
  opensidebar();
}
sidebarmenu.addEventListener("click", () => {
  const contains = sidebar.classList.contains("sidebar-active");

  if (contains) {
    sidebar.classList.add("sidebar-active");
    sidebarmenu.classList.add("sidebar-menu-active");
  } else {
    sidebarmenu.classList.remove("sidebar-menu-active");

    sidebar.classList.remove("sidebar-active");
  }
});
function opensidebar() {
  const contains = sidebar.classList.contains("sidebar-active");
  const contains2 = sidebarright.classList.contains("sidebar-right-active");
  if (contains) {
    sidebar.classList.remove("sidebar-active");
    sidebarmenu.classList.remove("sidebar-menu-active");
  } else {
    sidebarmenu.classList.add("sidebar-menu-active");
    sidebar.classList.add("sidebar-active");
    if (contains2) {
      sidebarright.classList.remove("sidebar-right-active");
      sidebarrigntmobile.classList.remove("sidebar-rignt-mobile-active");
    }
  }
}

sidebarrigntmobile.addEventListener("click", () => {
  const contains = sidebarright.classList.contains("sidebar-right-active");
  const contains2 = sidebar.classList.contains("sidebar-active");

  if (contains) {
    sidebarright.classList.remove("sidebar-right-active");
    sidebarrigntmobile.classList.remove("sidebar-rignt-mobile-active");
    mobileavatar.setAttribute("class", "far fa-user avatar-icon");
  } else {
    if (contains2) {
      sidebar.classList.remove("sidebar-active");
      sidebarmenu.classList.remove("sidebar-menu-active");
    }
    sidebarright.classList.add("sidebar-right-active");
    sidebarrigntmobile.classList.add("sidebar-rignt-mobile-active");
    mobileavatar.setAttribute("class", "far fa-times-circle avatar-icon");
  }
});
