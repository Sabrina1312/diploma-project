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

// Запускать после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  const span = document.querySelector(".languages__wrapper h3 .lang-highlight");
  if (span) observer.observe(span);
});
