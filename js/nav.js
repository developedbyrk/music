document.addEventListener("DOMContentLoaded", function () {
  const icon = document.querySelector(".navigation i"); // Select the icon
  const navList = document.querySelector(".nav-list"); // Select the nav list

  icon.addEventListener("click", function (event) {
    event.stopPropagation();

    // Toggle the 'show' class
    navList.classList.toggle("show");
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".navigation")) {
      navList.classList.remove("show");
    }
  });
});
