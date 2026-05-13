// ============================================================
// МОДУЛЬ 1: АДАПТИВНЫЕ ИЗОБРАЖЕНИЯ В БЕГУЩЕЙ СТРОКЕ
// ============================================================

/**
 * Функция обновления изображений в бегущей строке (scroll)
 * Меняет src изображений в зависимости от ширины экрана
 * Для оптимизации загрузки на разных устройствах
 */
function updateScrollImages() {
  // Определяем текущую ширину окна браузера
  const width = window.innerWidth;
  let imgSrc; // Переменная для хранения пути к изображению

  // Выбираем изображение в зависимости от ширины экрана
  if (width <= 480) {
    // Мобильные устройства (телефоны)
    imgSrc = "./images/scroll-line-mobile.png";
  } else if (width <= 768) {
    // Планшеты (горизонтальная ориентация)
    imgSrc = "./images/scroll-line-tablet.png";
  } else {
    // Десктопы и ноутбуки
    imgSrc = "./images/scroll-line.png";
  }

  // Находим ВСЕ изображения внутри элемента с классом ".scroll"
  const allImages = document.querySelectorAll(".scroll img");

  // Для каждого найденного изображения меняем src на выбранный
  allImages.forEach((img) => {
    img.src = imgSrc;
  });
}

// Запускаем функцию при полной загрузке DOM-дерева
window.addEventListener("DOMContentLoaded", updateScrollImages);

/**
 * Запускаем функцию при изменении размера окна (ресайзе)
 * Используем debounce (задержку) для оптимизации производительности
 *
 * Почему debounce:
 * - При ресайзе браузер генерирует множество событий
 * - Debounce позволяет выполнить функцию только один раз, когда пользователь закончил изменять размер
 * - Это улучшает производительность и предотвращает лишние перерисовки
 */
let resizeTimer; // Таймер для debounce
window.addEventListener("resize", function () {
  // Очищаем предыдущий таймер, если он есть
  clearTimeout(resizeTimer);
  // Устанавливаем новый таймер с задержкой 200мс
  resizeTimer = setTimeout(updateScrollImages, 200);
});

// ============================================================
// МОДУЛЬ 2: ИНТЕРАКТИВНЫЕ ЭФФЕКТЫ ПРИ НАВЕДЕНИИ
// ============================================================

/**
 * Получение элементов для анимации на главной странице
 * Элементы образуют "крест" взаимосвязанных блоков
 * При наведении на один блок - меняются все связанные элементы
 */
const specialText = document.querySelector(".special-text"); // Особенный текст (верхний)
const mainText = document.querySelector(".main-text"); // Основной текст (верхний)
const specialTextDown = document.querySelector(".special-text-down"); // Особенный текст (нижний)
const mainTextDown = document.querySelector(".main-text-down"); // Основной текст (нижний)

/**
 * Функция сброса всех стилей к исходному состоянию
 * Используется при уходе мыши с любого элемента
 * Также устанавливает начальные стили при загрузке страницы
 */
function resetAllStyles() {
  // Стили для верхнего особенного текста
  specialText.style.backgroundColor = "#0000ca";
  specialText.style.color = "#fff";

  // Стили для верхнего основного текста
  mainText.style.backgroundColor = "transparent";
  mainText.style.color = "#797979";

  // Стили для нижнего особенного текста
  specialTextDown.style.backgroundColor = "transparent";
  specialTextDown.style.color = "#dedede";

  // Стили для нижнего основного текста
  mainTextDown.style.backgroundColor = "transparent";
  mainTextDown.style.color = "#0000ca";
}

// ============================================================
// ОБРАБОТЧИКИ НАВЕДЕНИЯ (hover)
// ============================================================

/**
 * Hover на mainText (верхний основной текст)
 * Эффект: основной текст становится синим, особенный - прозрачным
 * Нижние тексты меняют цвет (создаётся эффект взаимосвязи)
 */
mainText.addEventListener("mouseenter", () => {
  // Изменяем верхний основной текст
  mainText.style.backgroundColor = "#0000ca";
  mainText.style.color = "#fff";

  // Изменяем верхний особенный текст
  specialText.style.backgroundColor = "transparent";
  specialText.style.color = "#797979";

  // Изменяем нижние тексты
  specialTextDown.style.color = "#0000ca";
  mainTextDown.style.color = "#dedede";
});

/**
 * Hover на specialTextDown (нижний особенный текст)
 * Эффект: нижний особенный текст становится синим, остальные адаптируются
 * Создаётся цветовой переход между элементами
 */
specialTextDown.addEventListener("mouseenter", () => {
  // Изменяем нижний особенный текст
  specialTextDown.style.backgroundColor = "#0000ca";
  specialTextDown.style.color = "#fff";

  // Изменяем нижний основной текст
  mainTextDown.style.color = "#797979";

  // Изменяем верхние тексты
  specialText.style.backgroundColor = "transparent";
  specialText.style.color = "#0000ca";
  mainText.style.color = "#dedede";
});

/**
 * Hover на mainTextDown (нижний основной текст)
 * Эффект: нижний основной текст становится синим
 * Верхние тексты получают прозрачность для контраста
 */
mainTextDown.addEventListener("mouseenter", () => {
  // Изменяем нижний основной текст
  mainTextDown.style.backgroundColor = "#0000ca";
  mainTextDown.style.color = "#fff";

  // Изменяем верхние тексты
  specialText.style.backgroundColor = "transparent";
  specialText.style.color = "#dedede";
  mainText.style.color = "#0000ca";

  // Изменяем нижний особенный текст
  specialTextDown.style.color = "#797979";
});

/**
 * Hover на specialText (верхний особенный текст)
 * Эффект: возвращает все тексты к "спокойному" состоянию
 * Сбрасывает фоновые цвета, оставляя только цветные тексты
 */
specialText.addEventListener("mouseenter", () => {
  // Сбрасываем фоны у всех текстов
  mainText.style.backgroundColor = "transparent";
  specialTextDown.style.backgroundColor = "transparent";
  mainTextDown.style.backgroundColor = "transparent";

  // Устанавливаем цвета для текстов
  mainText.style.color = "#797979";
  specialTextDown.style.color = "#dedede";
  mainTextDown.style.color = "#0000ca";
  // specialText при этом остаётся без изменений
});

// ============================================================
// ВОССТАНОВЛЕНИЕ СТИЛЕЙ ПРИ УХОДЕ МЫШИ
// ============================================================

/**
 * При уходе курсора с любого из четырёх элементов
 * вызывается функция сброса всех стилей
 * Это возвращает интерфейс в исходное состояние
 */
mainText.addEventListener("mouseleave", resetAllStyles);
specialTextDown.addEventListener("mouseleave", resetAllStyles);
mainTextDown.addEventListener("mouseleave", resetAllStyles);
specialText.addEventListener("mouseleave", resetAllStyles);

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================

/**
 * Устанавливаем начальные стили при загрузке страницы
 * Это гарантирует, что при первом отображении элементы
 * будут иметь правильные цвета и фоны
 */
resetAllStyles();
