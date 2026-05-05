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

const burger = document.querySelector(".header__burger");
const mobileMenu = document.querySelector(".mobile-menu");
const closeButton = document.querySelector(".close-button");
const body = document.body;
const docTlement = document.documentElement;

if (burger) {
  burger.addEventListener("click", () => {
    mobileMenu.classList.add("active");
    body.classList.add("lock");
    docTlement.classList.add("lock");
  });
}

if (closeButton) {
  closeButton.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    body.classList.remove("lock");
    docTlement.classList.remove("lock");
  });
}
