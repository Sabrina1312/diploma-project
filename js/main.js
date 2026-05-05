const buttonUp = document.querySelector(".button-up");

window.addEventListener("scroll", () => {
  if (window.scrollY > window.innerHeight) {
    buttonUp.classList.add("visible");
  } else {
    buttonUp.classList.remove("visible");
  }
});

buttonUp.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
