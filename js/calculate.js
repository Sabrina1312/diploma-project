//Калькулятор
(function () {
  // Получаем все элементы основной формы
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

  // Элементы попапов
  const firstPopup = document.getElementById("sending");
  const secondPopup = document.getElementById("calculatePopup");

  // Элементы формы в попапе
  const sendingLangFrom = document.getElementById("sendingLang");
  const sendingLangTo = document.querySelector(
    "#sending .amendment__grid #langTo",
  );
  const sendingDocumentType = document.querySelector("#sending #documentType");
  const sendingPagesCount = document.querySelector(
    "#sending .amendment__column-other input",
  );
  const sendingNotaryCert = document.querySelector("#sending #notaryCert");
  const sendingNotaryCopy = document.querySelector("#sending #notaryCopy");
  const sendingNonUrgent = document.querySelector("#sending #nonUrgent");
  const sendingUrgent = document.querySelector("#sending #urgent");
  const sendingSuperUrgent = document.querySelector("#sending #superUrgent");

  // Поля для ввода личных данных
  const lastNameInput = document.querySelector(
    "#sending .contacts__item:nth-child(1) input",
  );
  const firstNameInput = document.querySelector(
    "#sending .contacts__item:nth-child(2) input",
  );
  const emailInput = document.querySelector(
    "#sending .contacts__item:nth-child(3) input",
  );
  const phoneInput = document.querySelector(
    "#sending .contacts__item:nth-child(4) input",
  );
  const privacyCheckbox = document.getElementById("privacy");
  const submitBtn = document.querySelector("#sending .sending__burtton");
  const messageTextarea = document.getElementById("calcMessage");

  // Кнопка закрытия второго попапа
  const closeSuccessPopup = document.querySelector(
    "#calculatePopup .success-popup__close",
  );

  // ЦЕНЫ (согласно ТЗ)
  const PRICE_PER_PAGE = 700;
  const EDUCATION_SURCHARGE = 100;
  const LEGAL_MEDICAL_OTHER_SURCHARGE = 200;
  const NOTARY_CERT_PRICE = 800;
  const NOTARY_COPY_PRICE_PER_PAGE = 200;
  const URGENT_PRICE = 500;
  const SUPER_URGENT_PRICE = 1000;

  // Функция для управления чекбоксами (только один из двух)
  function setupMutualExclusiveCheckboxes() {
    if (notaryCert && notaryCopy) {
      notaryCert.addEventListener("change", function () {
        if (this.checked) {
          notaryCopy.checked = false;
        }
        calculatePrice();
      });

      notaryCopy.addEventListener("change", function () {
        if (this.checked) {
          notaryCert.checked = false;
        }
        calculatePrice();
      });
    }
  }

  // Функция управления селектом "На"
  function updateLangToOptions() {
    const fromValue = langFrom.value;
    const currentToValue = langTo.value;
    const options = langTo.querySelectorAll("option");

    if (fromValue === "russian") {
      options.forEach((option) => {
        if (option.value === "russian") {
          option.style.display = "none";
          if (currentToValue === "russian") {
            langTo.value = "";
          }
        } else {
          option.style.display = "block";
        }
      });
    } else if (fromValue && fromValue !== "") {
      options.forEach((option) => {
        if (option.value === "russian") {
          option.style.display = "block";
          langTo.value = "russian";
        } else {
          option.style.display = "none";
        }
      });
    } else {
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
    const hasRussian = fromVal === "russian" || toVal === "russian";
    const isDifferent = fromVal !== toVal;
    return hasRussian && isDifferent;
  }

  // Функция расчета стоимости
  function calculatePrice() {
    if (!isLanguageValid()) {
      priceDisplay.textContent = "0 РУБ.";
      return 0;
    }

    let total = 0;
    let pages = parseInt(pagesCount.value, 10);
    if (isNaN(pages) || pages < 1) pages = 0;

    total += pages * PRICE_PER_PAGE;

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
        break;
    }

    if (notaryCert.checked) total += NOTARY_CERT_PRICE;
    if (notaryCopy.checked) total += pages * NOTARY_COPY_PRICE_PER_PAGE;

    if (urgent.checked) total += URGENT_PRICE;
    else if (superUrgent.checked) total += SUPER_URGENT_PRICE;

    priceDisplay.textContent = total.toLocaleString("ru-RU") + " РУБ.";
    return total;
  }

  // Функция синхронизации данных из калькулятора в попап
  function syncDataToPopup() {
    // Синхронизация языков
    if (sendingLangFrom) {
      sendingLangFrom.value = langFrom.value;
    }
    if (sendingLangTo) {
      sendingLangTo.value = langTo.value;
    }

    // Синхронизация вида документа
    if (sendingDocumentType) {
      sendingDocumentType.value = documentType.value;
    }

    // Синхронизация количества страниц
    if (sendingPagesCount) {
      sendingPagesCount.value = pagesCount.value;
    }

    // Синхронизация доп. услуг (радиокнопки)
    if (sendingNotaryCert && sendingNotaryCopy) {
      if (notaryCert.checked) {
        sendingNotaryCert.checked = true;
        sendingNotaryCopy.checked = false;
      } else if (notaryCopy.checked) {
        sendingNotaryCert.checked = false;
        sendingNotaryCopy.checked = true;
      } else {
        sendingNotaryCert.checked = false;
        sendingNotaryCopy.checked = false;
      }
    }

    // Синхронизация тарифа
    if (sendingNonUrgent && sendingUrgent && sendingSuperUrgent) {
      if (nonUrgent.checked) {
        sendingNonUrgent.checked = true;
        sendingUrgent.checked = false;
        sendingSuperUrgent.checked = false;
      } else if (urgent.checked) {
        sendingNonUrgent.checked = false;
        sendingUrgent.checked = true;
        sendingSuperUrgent.checked = false;
      } else if (superUrgent.checked) {
        sendingNonUrgent.checked = false;
        sendingUrgent.checked = false;
        sendingSuperUrgent.checked = true;
      }
    }
  }

  // Функция открытия первого попапа
  function openFirstPopup() {
    if (firstPopup) {
      syncDataToPopup();
      firstPopup.classList.add("success-popup_opened");
      document.body.style.overflow = "hidden";
    }
  }

  // Функция закрытия первого попапа
  function closeFirstPopup() {
    if (firstPopup) {
      firstPopup.classList.remove("success-popup_opened");
      document.body.style.overflow = "";
    }
  }

  // Функция открытия второго попапа (успешно)
  function openSecondPopup() {
    if (secondPopup) {
      secondPopup.classList.add("success-popup_opened");
      document.body.style.overflow = "hidden";
    }
  }

  // Функция закрытия второго попапа
  function closeSecondPopup() {
    if (secondPopup) {
      secondPopup.classList.remove("success-popup_opened");
      document.body.style.overflow = "";
    }
  }

  // Проверка валидности формы в попапе
  function isPopupFormValid() {
    const lastName = lastNameInput ? lastNameInput.value.trim() : "";
    const firstName = firstNameInput ? firstNameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";

    if (!lastName) {
      alert('Пожалуйста, заполните поле "Фамилия"');
      lastNameInput?.focus();
      return false;
    }
    if (!firstName) {
      alert('Пожалуйста, заполните поле "Имя"');
      firstNameInput?.focus();
      return false;
    }
    if (!email) {
      alert('Пожалуйста, заполните поле "Email"');
      emailInput?.focus();
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      alert("Пожалуйста, введите корректный Email");
      emailInput?.focus();
      return false;
    }
    if (!phone) {
      alert('Пожалуйста, заполните поле "Номер телефона"');
      phoneInput?.focus();
      return false;
    }
    if (!privacyCheckbox || !privacyCheckbox.checked) {
      alert("Пожалуйста, примите условия Политики конфиденциальности");
      return false;
    }

    return true;
  }

  // Функция отправки данных
  function submitFormData() {
    if (!isPopupFormValid()) {
      return;
    }

    // Собираем данные для отправки
    const formData = {
      lastName: lastNameInput?.value.trim() || "",
      firstName: firstNameInput?.value.trim() || "",
      email: emailInput?.value.trim() || "",
      phone: phoneInput?.value.trim() || "",
      message: messageTextarea?.value || "",
      languageFrom: sendingLangFrom?.value || "",
      languageTo: sendingLangTo?.value || "",
      documentType: sendingDocumentType?.value || "",
      pagesCount: sendingPagesCount?.value || "",
      notaryCert: sendingNotaryCert?.checked || false,
      notaryCopy: sendingNotaryCopy?.checked || false,
      tariff: sendingNonUrgent?.checked
        ? "nonUrgent"
        : sendingUrgent?.checked
          ? "urgent"
          : "superUrgent",
      totalPrice: priceDisplay?.textContent || "0 РУБ.",
    };

    // Здесь можно отправить данные на сервер
    console.log("Отправка данных:", formData);

    // Имитация отправки на сервер
    setTimeout(() => {
      // Закрываем первый попап
      closeFirstPopup();

      // Открываем второй попап об успехе
      openSecondPopup();
    }, 300);
  }

  // Обработчики для попапов (закрытие по клику на оверлей)
  function setupPopupEvents() {
    // Закрытие первого попапа по клику на оверлей
    if (firstPopup) {
      firstPopup.addEventListener("click", function (e) {
        if (e.target === firstPopup) {
          closeFirstPopup();
        }
      });
    }

    // Закрытие второго попапа по клику на оверлей или кнопку
    if (secondPopup) {
      secondPopup.addEventListener("click", function (e) {
        if (e.target === secondPopup) {
          closeSecondPopup();
        }
      });

      if (closeSuccessPopup) {
        closeSuccessPopup.addEventListener("click", function () {
          closeSecondPopup();
        });
      }
    }
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

    // Кнопка отправки в основном калькуляторе
    if (sendButton) {
      sendButton.addEventListener("click", function () {
        if (!isLanguageValid()) {
          alert(
            "⚠️ Ошибка: перевод возможен только если один из языков — русский.\n\nПожалуйста, выберите:\n• Русский → Иностранный\n• Иностранный → Русский",
          );
          return;
        }
        openFirstPopup();
      });
    }

    // Кнопка отправки в попапе
    if (submitBtn) {
      submitBtn.addEventListener("click", function (e) {
        e.preventDefault();
        submitFormData();
      });
    }
  }

  // Обновление состояния кнопки отправки в попапе (активация при согласии)
  function setupPrivacyCheckbox() {
    if (privacyCheckbox && submitBtn) {
      privacyCheckbox.addEventListener("change", function () {
        submitBtn.disabled = !this.checked;
      });
    }
  }

  // Инициализация
  function init() {
    setupMutualExclusiveCheckboxes();
    setupPopupEvents();
    setupPrivacyCheckbox();
    bindEvents();
    updateLangToOptions();
    calculatePrice();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
