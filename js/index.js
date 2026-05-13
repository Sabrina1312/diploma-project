//Функция меняющая image в бегущей строке, в зависимости от ширины экрана
function updateScrollImages() {
  // Определяем ширину экрана
  const width = window.innerWidth;
  let imgSrc;

  if (width <= 480) {
    imgSrc = "./images/scroll-line-mobile.png"; // для мобильных
  } else if (width <= 768) {
    imgSrc = "./images/scroll-line-tablet.png"; // для планшета
  } else {
    imgSrc = "./images/scroll-line.png"; // для десктопа
  }

  // Находим ВСЕ img внутри .scroll и меняем src
  const allImages = document.querySelectorAll(".scroll img");
  allImages.forEach((img) => {
    img.src = imgSrc;
  });
}

// Запускаем при загрузке страницы
window.addEventListener("DOMContentLoaded", updateScrollImages);

// Запускаем при изменении размера окна (с задержкой)
let resizeTimer;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(updateScrollImages, 200);
});

//Функция изменения цвета и бэкграунда элементов на главной странице
const specialText = document.querySelector(".special-text");
const mainText = document.querySelector(".main-text");
const specialTextDown = document.querySelector(".special-text-down");
const mainTextDown = document.querySelector(".main-text-down");

// Функция сброса всех стилей
function resetAllStyles() {
  specialText.style.backgroundColor = "#0000ca";
  specialText.style.color = "#fff";
  mainText.style.backgroundColor = "transparent";
  mainText.style.color = "#797979";
  specialTextDown.style.backgroundColor = "transparent";
  specialTextDown.style.color = "#dedede";
  mainTextDown.style.backgroundColor = "transparent";
  mainTextDown.style.color = "#0000ca";
}

// Hover на mainText
mainText.addEventListener("mouseenter", () => {
  mainText.style.backgroundColor = "#0000ca";
  mainText.style.color = "#fff";
  specialText.style.backgroundColor = "transparent";
  specialText.style.color = "#797979";
  specialTextDown.style.color = "#0000ca";
  mainTextDown.style.color = "#dedede";
});

// Hover на specialTextDown
specialTextDown.addEventListener("mouseenter", () => {
  specialTextDown.style.backgroundColor = "#0000ca";
  specialTextDown.style.color = "#fff";
  mainTextDown.style.color = "#797979";
  specialText.style.backgroundColor = "transparent";
  specialText.style.color = "#0000ca";
  mainText.style.color = "#dedede";
});

// Hover на mainTextDown
mainTextDown.addEventListener("mouseenter", () => {
  mainTextDown.style.backgroundColor = "#0000ca";
  mainTextDown.style.color = "#fff";
  specialText.style.backgroundColor = "transparent";
  specialText.style.color = "#dedede";
  mainText.style.color = "#0000ca";
  specialTextDown.style.color = "#797979";
});

// Hover на specialText
specialText.addEventListener("mouseenter", () => {
  mainText.style.backgroundColor = "transparent";
  mainText.style.color = "#797979";
  specialTextDown.style.backgroundColor = "transparent";
  specialTextDown.style.color = "#dedede";
  mainTextDown.style.backgroundColor = "transparent";
  mainTextDown.style.color = "#0000ca";
});

// Восстановление при уходе мыши
mainText.addEventListener("mouseleave", resetAllStyles);
specialTextDown.addEventListener("mouseleave", resetAllStyles);
mainTextDown.addEventListener("mouseleave", resetAllStyles);
specialText.addEventListener("mouseleave", resetAllStyles);

// Инициализация
resetAllStyles();
