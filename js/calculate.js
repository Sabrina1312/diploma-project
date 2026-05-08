// // Цены
// const PRICES = {
//   // Базовые цены за перевод (за первую страницу)
//   basePrice: {
//     personal: 500, // личные документы
//     education: 600, // образование (+100)
//     legal: 700, // юридические (+200)
//     medical: 700, // медицинские (+200)
//     other: 700, // другое (+200)
//   },
//   // Доплата за тариф
//   tariff: {
//     nonUrgent: 0, // несрочный
//     urgent: 500, // срочный
//     superUrgent: 1000, // сверхсрочный
//   },
//   // Доп. услуги
//   notaryCert: 800, // нотариальное заверение
//   notaryCopyPerPage: 200, // копия перевода за страницу
//   extraPage: 700, // дополнительная страница
// };

// // Элементы формы
// const langFrom = document.getElementById("langFrom");
// const langTo = document.getElementById("langTo");
// const documentType = document.getElementById("documentType");
// const pagesCount = document.getElementById("pagesCount");
// const notaryCert = document.getElementById("notaryCert");
// const notaryCopy = document.getElementById("notaryCopy");
// const tariff = document.getElementById("tariff");
// const priceDisplay = document.getElementById("priceDisplay");

// // Проверка: один из языков должен быть русским
// function isLanguageValid() {
//   const from = langFrom.value;
//   const to = langTo.value;

//   if (!from || !to) return false;

//   // Оба языка выбраны
//   // Проверяем: один из них должен быть русским
//   return from === "russian" || to === "russian";
// }

// // Получить базовую цену
// function getBasePrice() {
//   const type = documentType.value;
//   return PRICES.basePrice[type] || PRICES.basePrice.personal;
// }

// // Получить доплату за количество страниц
// function getPagesPrice() {
//   const pages = parseInt(pagesCount.value) || 1;
//   if (pages <= 1) return 0;
//   return (pages - 1) * PRICES.extraPage;
// }

// // Получить стоимость дополнительных услуг
// function getExtraServicesPrice() {
//   let total = 0;

//   // Нотариальное заверение
//   if (notaryCert.checked) {
//     total += PRICES.notaryCert;
//   }

//   // Нотариальная копия (за каждую страницу)
//   if (notaryCopy.checked) {
//     const pages = parseInt(pagesCount.value) || 1;
//     total += pages * PRICES.notaryCopyPerPage;
//   }

//   return total;
// }

// // Получить стоимость тарифа
// function getTariffPrice() {
//   const selectedTariff = tariff.value;
//   return PRICES.tariff[selectedTariff] || 0;
// }

// // Расчет общей стоимости
// function calculatePrice() {
//   // Проверка валидности языков
//   if (!isLanguageValid()) {
//     priceDisplay.textContent = "ОШИБКА: Один из языков должен быть русским";
//     return;
//   }

//   const basePrice = getBasePrice();
//   const pagesPrice = getPagesPrice();
//   const servicesPrice = getExtraServicesPrice();
//   const tariffPrice = getTariffPrice();

//   const total = basePrice + pagesPrice + servicesPrice + tariffPrice;

//   priceDisplay.textContent = total.toLocaleString("ru-RU") + " РУБ.";
// }

// // Обработчики событий
// function bindEvents() {
//   langFrom.addEventListener("change", calculatePrice);
//   langTo.addEventListener("change", calculatePrice);
//   documentType.addEventListener("change", calculatePrice);
//   pagesCount.addEventListener("input", calculatePrice);
//   notaryCert.addEventListener("change", calculatePrice);
//   notaryCopy.addEventListener("change", calculatePrice);
//   tariff.addEventListener("change", calculatePrice);
// }

// // Инициализация
// function init() {
//   bindEvents();
//   calculatePrice();
// }

// init();
const langFrom = document.getElementById("langFrom");
const langTo = document.getElementById("langTo");

// Функция для блокировки одинаковых языков
function preventSameLanguage() {
  const fromValue = langFrom.value;
  const toValue = langTo.value;

  // Если выбраны одинаковые языки
  if (fromValue === toValue) {
    // Определяем, какой селект меняли последним
    // и меняем значение другого селекта
    if (document.activeElement === langFrom) {
      langTo.value = "";
    } else {
      langFrom.value = "";
    }
  }
}

// Функция для исключения выбранного языка из другого селекта
function updateOptions() {
  const fromValue = langFrom.value;
  const toValue = langTo.value;

  // Сохраняем все опции
  const allOptions = Array.from(langFrom.options);

  // Очищаем оба селекта от disabled
  Array.from(langFrom.options).forEach((opt) => (opt.disabled = false));
  Array.from(langTo.options).forEach((opt) => (opt.disabled = false));

  // Если выбран язык в langFrom, отключаем его в langTo
  if (fromValue) {
    const toOption = langTo.querySelector(`option[value="${fromValue}"]`);
    if (toOption) toOption.disabled = true;
  }

  // Если выбран язык в langTo, отключаем его в langFrom
  if (toValue) {
    const fromOption = langFrom.querySelector(`option[value="${toValue}"]`);
    if (fromOption) fromOption.disabled = true;
  }

  // Если оба выбраны и совпадают — сбрасываем
  if (fromValue === toValue && fromValue && toValue) {
    if (document.activeElement === langFrom) {
      langFrom.value = "";
    } else {
      langTo.value = "";
    }
    updateOptions();
  }
}

// Слушаем изменения
langFrom.addEventListener("change", () => {
  updateOptions();
  preventSameLanguage();
});

langTo.addEventListener("change", () => {
  updateOptions();
  preventSameLanguage();
});

// Инициализация при загрузке
updateOptions();
