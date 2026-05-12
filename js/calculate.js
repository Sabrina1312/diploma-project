(function () {
  // Получаем все элементы формы
  const langFrom = document.getElementById("langFrom");
  const langTo = document.getElementById("langTo");
  const documentType = document.getElementById("documentType");
  const pagesCount = document.getElementById("pagesCount");
  const notaryCert = document.getElementById("notaryCert");
  const notaryCopy = document.getElementById("notaryCopy");
  const nonUrgent = document.getElementById("nonUrgent");
  const urgent = document.getElementById("urgent");
  const superUrgent = document.getElementById("superUrgent");
  const priceDisplay = document.getElementById("priceDisplay");
  const sendButton = document.querySelector(".calculate-button");

  // ЦЕНЫ (согласно ТЗ)
  const PRICE_PER_PAGE = 700; // 700 руб/страница
  const EDUCATION_SURCHARGE = 100; // документы об образовании
  const LEGAL_MEDICAL_OTHER_SURCHARGE = 200; // юридические, медицинские, другое
  const NOTARY_CERT_PRICE = 800; // нотариальное заверение
  const NOTARY_COPY_PRICE_PER_PAGE = 200; // нотариальная копия: 200 руб/страница
  const URGENT_PRICE = 500; // срочный (на следующий день)
  const SUPER_URGENT_PRICE = 1000; // сверхсрочный (от 2 часов)

  // Функция для управления чекбоксами (только один из двух)
  function setupMutualExclusiveCheckboxes() {
    if (notaryCert && notaryCopy) {
      // Когда кликают на notaryCert
      notaryCert.addEventListener("change", function () {
        if (this.checked) {
          notaryCopy.checked = false;
        }
        calculatePrice(); // пересчитываем цену
      });

      // Когда кликают на notaryCopy
      notaryCopy.addEventListener("change", function () {
        if (this.checked) {
          notaryCert.checked = false;
        }
        calculatePrice(); // пересчитываем цену
      });
    }
  }

  // Функция управления селектом "На"
  function updateLangToOptions() {
    const fromValue = langFrom.value;
    const currentToValue = langTo.value;

    // Получаем все option в langTo
    const options = langTo.querySelectorAll("option");

    if (fromValue === "russian") {
      // Если выбран русский в "С" → показываем все языки, кроме русского
      options.forEach((option) => {
        if (option.value === "russian") {
          option.style.display = "none";
          // Если текущее значение было русским, сбрасываем
          if (currentToValue === "russian") {
            langTo.value = "";
          }
        } else {
          option.style.display = "block";
        }
      });
    } else if (fromValue && fromValue !== "") {
      // Если выбран иностранный язык → показываем только русский
      options.forEach((option) => {
        if (option.value === "russian") {
          option.style.display = "block";
          // Автоматически выбираем русский
          langTo.value = "russian";
        } else {
          option.style.display = "none";
        }
      });
    } else {
      // Если ничего не выбрано в "С" → показываем все опции
      options.forEach((option) => {
        option.style.display = "block";
      });
      langTo.value = "";
    }
  }

  // Проверка валидности выбора языков
  function isLanguageValid() {
    const fromVal = langFrom.value;
    const toVal = langTo.value;

    if (!fromVal || !toVal) return false;

    // Проверка: один из языков русский и они разные
    const hasRussian = fromVal === "russian" || toVal === "russian";
    const isDifferent = fromVal !== toVal;

    return hasRussian && isDifferent;
  }

  // Функция расчета стоимости
  function calculatePrice() {
    // Проверяем языки
    if (!isLanguageValid()) {
      priceDisplay.textContent = "0 РУБ.";
      return 0;
    }

    let total = 0;

    // ===== 1. СТОИМОСТЬ ПЕРЕВОДА (количество страниц) =====
    let pages = parseInt(pagesCount.value, 10);
    if (isNaN(pages) || pages < 1) {
      pages = 0;
    }

    // Согласно ТЗ: (+700 руб/страница)
    total += pages * PRICE_PER_PAGE;

    // ===== 2. ВИД ДОКУМЕНТА =====
    const docType = documentType.value;
    switch (docType) {
      case "education":
        total += EDUCATION_SURCHARGE;
        break;
      case "legal":
      case "medical":
      case "other":
        total += LEGAL_MEDICAL_OTHER_SURCHARGE;
        break;
      default:
        // 'personal' - без надбавки
        break;
    }

    // ===== 3. ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ =====
    if (notaryCert.checked) {
      total += NOTARY_CERT_PRICE;
    }
    if (notaryCopy.checked) {
      total += pages * NOTARY_COPY_PRICE_PER_PAGE;
    }

    // ===== 4. ТАРИФ =====
    if (urgent.checked) {
      total += URGENT_PRICE; // срочный (на следующий день)
    } else if (superUrgent.checked) {
      total += SUPER_URGENT_PRICE; // сверхсрочный (от 2 часов)
    }
    // nonUrgent - без доплаты

    // Обновляем отображение
    priceDisplay.textContent = total.toLocaleString("ru-RU") + " РУБ.";
    return total;
  }

  // Обработчик изменения языка "С"
  function onLangFromChange() {
    updateLangToOptions();
    calculatePrice();
  }

  // Обработчик изменения языка "На"
  function onLangToChange() {
    calculatePrice();
  }

  // Навешиваем обработчики событий
  function bindEvents() {
    langFrom.addEventListener("change", onLangFromChange);
    langTo.addEventListener("change", onLangToChange);
    documentType.addEventListener("change", calculatePrice);
    pagesCount.addEventListener("input", calculatePrice);
    nonUrgent.addEventListener("change", calculatePrice);
    urgent.addEventListener("change", calculatePrice);
    superUrgent.addEventListener("change", calculatePrice);
  }

  // Кнопка отправки
  function initSendButton() {
    if (sendButton) {
      sendButton.addEventListener("click", function () {
        calculatePrice();

        if (!isLanguageValid()) {
          alert(
            "⚠️ Ошибка: перевод возможен только если один из языков — русский.\n\nПожалуйста, выберите:\n• Русский → Иностранный\n• Иностранный → Русский",
          );
          return;
        }

        const fromLangText =
          langFrom.options[langFrom.selectedIndex]?.text || "не выбран";
        const toLangText =
          langTo.options[langTo.selectedIndex]?.text || "не выбран";
        const docTypeText =
          documentType.options[documentType.selectedIndex]?.text || "";
        const pages = pagesCount.value || 0;

        let tariffText = "Несрочный";
        if (urgent.checked) tariffText = "Срочный (на следующий день)";
        else if (superUrgent.checked) tariffText = "Сверхсрочный (от 2 часов)";

        let additionalServices = [];
        if (notaryCert.checked)
          additionalServices.push("Нотариальное заверение");
        if (notaryCopy.checked)
          additionalServices.push("Нотариальная копия перевода");
        const additionalText = additionalServices.length
          ? additionalServices.join(", ")
          : "Нет";

        alert(
          `📄 ЗАПРОС ОТПРАВЛЕН\n\nПеревод: ${fromLangText} → ${toLangText}\nВид документа: ${docTypeText}\nКоличество страниц: ${pages}\nДоп. услуги: ${additionalText}\nТариф: ${tariffText}\n\nПредварительная стоимость: ${priceDisplay.textContent}\n\nС вами свяжется менеджер для уточнения деталей.`,
        );
      });
    }
  }

  // Инициализация
  function init() {
    setupMutualExclusiveCheckboxes(); // настраиваем взаимоисключающие чекбоксы
    bindEvents();
    initSendButton();
    updateLangToOptions(); // устанавливаем начальное состояние
    calculatePrice();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
