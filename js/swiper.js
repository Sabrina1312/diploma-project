const swiper = new Swiper(".reviews__swiper", {
  direction: "horizontal",
  loop: false,
  slidesPerView: 3,
  spaceBetween: 20,

  breakpoints: {
    320: {
      slidesPerView: 1.05,
      spaceBetween: 12,
    },
    630: {
      slidesPerView: 1.7,
      spaceBetween: 20,
    },
    760: {
      slidesPerView: 2.05,
      spaceBetween: 16,
    },
    900: {
      slidesPerView: 2.2,
      spaceBetween: 16,
    },
    1360: {
      slidesPerView: 3.05,
      spaceBetween: 20,
    },
    1440: {
      slidesPerView: 3.08,
      spaceBetween: 20,
    },
  },
});
