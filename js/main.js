// ============================================================
// КНОПКА "НАВЕРХ" (SCROLL TO TOP)
// ============================================================

// Находим кнопку с классом "button-up" (кнопка для скролла вверх)
const buttonUp = document.querySelector(".button-up");

// Отслеживаем событие прокрутки страницы
window.addEventListener("scroll", () => {
  // Если прокручено больше, чем высота одного экрана (viewport)
  if (window.scrollY > window.innerHeight) {
    // Показываем кнопку (добавляем класс visible)
    buttonUp.classList.add("visible");
  } else {
    // Скрываем кнопку (удаляем класс visible)
    buttonUp.classList.remove("visible");
  }
});

// При клике на кнопку - плавно прокручиваем страницу вверх
buttonUp.addEventListener("click", () => {
  // behavior: "smooth" - плавная анимация, top: 0 - прокрутка к началу страницы
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ============================================================
// МОБИЛЬНОЕ МЕНЮ (БУРГЕР)
// ============================================================

// Находим элементы для мобильного меню
const burger = document.querySelector(".header__burger"); // Кнопка-бургер
const mobileMenu = document.querySelector(".mobile-menu"); // Само мобильное меню
const closeButton = document.querySelector(".close-button"); // Кнопка закрытия меню
const body = document.body; // Тело страницы
const docTlement = document.documentElement; // HTML элемент (корневой)

// Обработчик открытия меню (если кнопка-бургер существует)
if (burger) {
  burger.addEventListener("click", () => {
    mobileMenu.classList.add("active"); // Показываем меню
    body.classList.add("lock"); // Блокируем скролл body
    docTlement.classList.add("lock"); // Блокируем скролл html
  });
}

// Обработчик закрытия меню (если кнопка закрытия существует)
if (closeButton) {
  closeButton.addEventListener("click", () => {
    mobileMenu.classList.remove("active"); // Скрываем меню
    body.classList.remove("lock"); // Разблокируем скролл body
    docTlement.classList.remove("lock"); // Разблокируем скролл html
  });
}

// ============================================================
// АНИМАЦИЯ ПОДСВЕТКИ ТЕКСТА ПРИ ПОЯВЛЕНИИ
// ============================================================

// Ждем полной загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  // Находим все элементы с классом "highlight-span" (текст для подсветки)
  const spanElements = document.querySelectorAll(".highlight-span");

  // Задержка перед добавлением класса (в миллисекундах)
  const DELAY_MS = 1000;

  // Если элементов нет - выходим из функции
  if (spanElements.length === 0) return;

  // Создаем Intersection Observer для отслеживания появления элементов в окне просмотра
  const observer = new IntersectionObserver(
    (entries) => {
      // Для каждого элемента, который попал в зону видимости
      entries.forEach((entry) => {
        // Если элемент виден (пересекается с окном просмотра)
        if (entry.isIntersecting) {
          // Ждем DELAY_MS миллисекунд и добавляем класс "visible"
          // (класс активирует CSS-анимацию подсветки)
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, DELAY_MS);

          // Прекращаем наблюдение за этим элементом (анимация сработала 1 раз)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1, // Элемент считается видимым, когда 10% его площади в зоне просмотра
    },
  );

  // Начинаем наблюдение за каждым элементом
  spanElements.forEach((element) => {
    observer.observe(element);
  });
});
