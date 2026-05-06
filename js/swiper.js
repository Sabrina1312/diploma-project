const swiper = new Swiper(".reviews__swiper", {
  direction: "horizontal",
  loop: false,
  slidesPerView: 3,
  spaceBetween: 20,
  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
  },
  breakpoints: {
    320: {
      slidesPerView: 1.05,
      spaceBetween: 12,
    },
    520: {
      slidesPerView: 1.7,
      spaceBetween: 20,
    },
    650: {
      slidesPerView: 2.05,
      spaceBetween: 16,
    },
    769: {
      slidesPerView: 2.2,
      spaceBetween: 16,
    },
    900: {
      slidesPerView: 3.05,
      spaceBetween: 20,
    },
    1440: {
      slidesPerView: 3.08,
      spaceBetween: 20,
    },
  },
  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // And if we need scrollbar
  scrollbar: {
    el: ".swiper-scrollbar",
  },
});
