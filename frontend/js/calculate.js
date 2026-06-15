// ============================================================
// КАЛЬКУЛЯТОР ЦЕН
// ============================================================

// Цены
const PriceConfig = {
  pricePerPage: 700,
  educationSurcharge: 100,
  legalMedicalOtherSurcharge: 200,
  notaryCertPrice: 800,
  notaryCopyPricePerPage: 200,
  urgentPrice: 500,
  superUrgentPrice: 1000,
};

// Калькулятор цен
const PriceCalculator = {
  calculate(
    pages,
    docType,
    notaryCertChecked,
    notaryCopyChecked,
    urgentChecked,
    superUrgentChecked,
  ) {
    let total = pages * PriceConfig.pricePerPage;

    if (docType === "education") {
      total += PriceConfig.educationSurcharge;
    } else if (["legal", "medical", "other"].includes(docType)) {
      total += PriceConfig.legalMedicalOtherSurcharge;
    }

    if (notaryCertChecked) total += PriceConfig.notaryCertPrice;
    if (notaryCopyChecked) total += pages * PriceConfig.notaryCopyPricePerPage;
    if (urgentChecked) total += PriceConfig.urgentPrice;
    else if (superUrgentChecked) total += PriceConfig.superUrgentPrice;

    return total;
  },

  formatPrice(price) {
    return price.toLocaleString("ru-RU") + " РУБ.";
  },
};

// Управление языками
const LanguageManager = {
  fromSelect: null,
  toSelect: null,

  init(fromSelectId, toSelectId) {
    this.fromSelect = document.getElementById(fromSelectId);
    this.toSelect = document.getElementById(toSelectId);
    return this;
  },

  updateToOptions() {
    if (!this.fromSelect || !this.toSelect) return;

    const fromValue = this.fromSelect.value;
    const options = this.toSelect.querySelectorAll("option");

    options.forEach((option) => {
      option.style.display = "block";
    });

    if (fromValue === "russian") {
      options.forEach((option) => {
        if (option.value === "russian") option.style.display = "none";
      });
      if (this.toSelect.value === "russian") this.toSelect.value = "";
    } else if (fromValue) {
      options.forEach((option) => {
        if (option.value !== "russian") option.style.display = "none";
      });
      this.toSelect.value = "russian";
    }
  },

  isValid() {
    const fromVal = this.fromSelect?.value;
    const toVal = this.toSelect?.value;
    if (!fromVal || !toVal) return false;
    return (fromVal === "russian" || toVal === "russian") && fromVal !== toVal;
  },

  getFrom() {
    return this.fromSelect?.value || "";
  },

  getTo() {
    return this.toSelect?.value || "";
  },

  onFromChange(callback) {
    if (this.fromSelect) {
      this.fromSelect.onchange = () => {
        this.updateToOptions();
        if (callback) callback();
      };
    }
  },

  onToChange(callback) {
    if (this.toSelect) {
      this.toSelect.onchange = () => {
        if (callback) callback();
      };
    }
  },
};

// Сбор данных калькулятора
const CalculatorData = {
  getLanguageFrom() {
    return document.getElementById("langFrom")?.value || "";
  },

  getLanguageTo() {
    return document.getElementById("langTo")?.value || "";
  },

  getDocumentType() {
    return document.getElementById("documentType")?.value || "personal";
  },

  getPagesCount() {
    return parseInt(document.getElementById("pagesCount")?.value || 1, 10);
  },

  getNotaryCert() {
    return document.getElementById("notaryCert")?.checked || false;
  },

  getNotaryCopy() {
    return document.getElementById("notaryCopy")?.checked || false;
  },

  isUrgent() {
    return document.getElementById("urgent")?.checked || false;
  },

  isSuperUrgent() {
    return document.getElementById("superUrgent")?.checked || false;
  },

  getAll() {
    return {
      languageFrom: this.getLanguageFrom(),
      languageTo: this.getLanguageTo(),
      documentType: this.getDocumentType(),
      pagesCount: this.getPagesCount(),
      notaryCert: this.getNotaryCert(),
      notaryCopy: this.getNotaryCopy(),
      urgent: this.isUrgent(),
      superUrgent: this.isSuperUrgent(),
    };
  },

  calculateTotal() {
    return PriceCalculator.calculate(
      this.getPagesCount(),
      this.getDocumentType(),
      this.getNotaryCert(),
      this.getNotaryCopy(),
      this.isUrgent(),
      this.isSuperUrgent(),
    );
  },
};

// Отображение цены
const PriceDisplay = {
  element: null,

  init(elementId) {
    this.element = document.getElementById(elementId);
    return this;
  },

  update() {
    if (this.element) {
      if (!LanguageManager.isValid()) {
        this.element.textContent = "0 РУБ.";
        return;
      }
      const total = CalculatorData.calculateTotal();
      this.element.textContent = PriceCalculator.formatPrice(total);
    }
  },
};

// Форма пользователя (для калькулятора)
const CalculatorUserForm = {
  fields: {},

  init(selectors) {
    this.fields = {
      lastName: document.getElementById(selectors.lastName),
      firstName: document.getElementById(selectors.firstName),
      email: document.getElementById(selectors.email),
      phone: document.getElementById(selectors.phone),
      message: document.getElementById(selectors.message),
      privacy: document.getElementById(selectors.privacy),
    };
    return this;
  },

  getData() {
    return {
      lastName: this.fields.lastName?.value.trim() || "",
      firstName: this.fields.firstName?.value.trim() || "",
      email: this.fields.email?.value.trim() || "",
      phone: this.fields.phone?.value.trim() || "",
      message: this.fields.message?.value || "",
      privacy: this.fields.privacy?.checked || false,
    };
  },

  clear() {
    if (this.fields.lastName) this.fields.lastName.value = "";
    if (this.fields.firstName) this.fields.firstName.value = "";
    if (this.fields.email) this.fields.email.value = "";
    if (this.fields.phone) this.fields.phone.value = "";
    if (this.fields.message) this.fields.message.value = "";
    if (this.fields.privacy) this.fields.privacy.checked = false;
  },

  clearCalculator() {
    const langFrom = document.getElementById("langFrom");
    const langTo = document.getElementById("langTo");
    const documentType = document.getElementById("documentType");
    const pagesCount = document.getElementById("pagesCount");
    const notaryCert = document.getElementById("notaryCert");
    const notaryCopy = document.getElementById("notaryCopy");
    const nonUrgent = document.getElementById("nonUrgent");
    const urgent = document.getElementById("urgent");
    const superUrgent = document.getElementById("superUrgent");

    if (langFrom) langFrom.value = "";
    if (langTo) langTo.value = "russian";
    if (documentType) documentType.value = "personal";
    if (pagesCount) pagesCount.value = "1";
    if (notaryCert) notaryCert.checked = false;
    if (notaryCopy) notaryCopy.checked = false;
    if (nonUrgent) nonUrgent.checked = true;
    if (urgent) urgent.checked = false;
    if (superUrgent) superUrgent.checked = false;

    LanguageManager.updateToOptions();
  },

  validate() {
    let isValid = true;
    Validator.clearAllErrors();

    const lastName = this.fields.lastName?.value.trim() || "";
    if (!lastName) {
      isValid = false;
      Validator.showError(this.fields.lastName, 'Заполните поле "Фамилия"');
    }

    const firstName = this.fields.firstName?.value.trim() || "";
    if (!firstName) {
      isValid = false;
      Validator.showError(this.fields.firstName, 'Заполните поле "Имя"');
    }

    const email = this.fields.email?.value.trim() || "";
    if (!email) {
      isValid = false;
      Validator.showError(this.fields.email, 'Заполните поле "Email"');
    } else if (!Validator.email(email)) {
      isValid = false;
      Validator.showError(this.fields.email, "Введите корректный email");
    }

    const phone = this.fields.phone?.value.trim() || "";
    if (!phone) {
      isValid = false;
      Validator.showError(this.fields.phone, 'Заполните поле "Телефон"');
    } else if (!Validator.phone(phone)) {
      isValid = false;
      Validator.showError(this.fields.phone, "Введите корректный номер");
    }

    if (!this.fields.privacy?.checked) {
      isValid = false;
      const privacyLabel = this.fields.privacy?.closest(".sending__privacy");
      if (privacyLabel && !privacyLabel.querySelector(".error-message")) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.textContent = "Примите условия Политики конфиденциальности";
        privacyLabel.appendChild(errorDiv);
      }
    }

    return isValid;
  },
};

// Взаимоисключающие чекбоксы
const ExclusiveCheckboxes = {
  init(checkbox1, checkbox2, onChangeCallback) {
    const cb1 = document.getElementById(checkbox1);
    const cb2 = document.getElementById(checkbox2);

    if (cb1 && cb2) {
      const handler1 = () => {
        if (cb1.checked) cb2.checked = false;
        if (onChangeCallback) onChangeCallback();
      };
      const handler2 = () => {
        if (cb2.checked) cb1.checked = false;
        if (onChangeCallback) onChangeCallback();
      };

      cb1.removeEventListener("change", handler1);
      cb2.removeEventListener("change", handler2);
      cb1.addEventListener("change", handler1);
      cb2.addEventListener("change", handler2);
    }

    return { cb1, cb2 };
  },
};

// Отправка заказа (с минимальной задержкой лоадера 600ms)
const OrderManager = {
  async submit(userData, calculatorData, file) {
    // Показываем лоадер и запоминаем время
    const loaderElement = document.getElementById("loader");
    const startTime = Date.now();

    if (loaderElement) {
      loaderElement.classList.add("loader-visible");
      console.log("✅ Лоадер показан в калькуляторе");
    }

    const formData = new FormData();

    const orderPayload = {
      user: userData,
      order: {
        languageFrom: calculatorData.languageFrom,
        languageTo: calculatorData.languageTo,
        documentType: calculatorData.documentType,
        pagesCount: calculatorData.pagesCount,
        notaryCert: calculatorData.notaryCert,
        notaryCopy: calculatorData.notaryCopy,
        urgent: calculatorData.urgent,
        superUrgent: calculatorData.superUrgent,
        totalPrice: calculatorData.totalPrice,
      },
    };

    formData.append("orderData", JSON.stringify(orderPayload));

    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      // Минимальная задержка 600 мс, чтобы лоадер был виден
      const elapsed = Date.now() - startTime;
      const minDelay = 600;

      if (elapsed < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
      }

      // Скрываем лоадер
      if (loaderElement) {
        loaderElement.classList.remove("loader-visible");
        console.log("✅ Лоадер скрыт");
      }
      return result;
    } catch (error) {
      // Минимальная задержка перед скрытием
      const elapsed = Date.now() - startTime;
      const minDelay = 600;

      if (elapsed < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
      }

      // Скрываем лоадер при ошибке
      if (loaderElement) {
        loaderElement.classList.remove("loader-visible");
        console.log("❌ Лоадер скрыт (ошибка)");
      }
      console.error("Ошибка:", error);
      return { success: false, error: error.message };
    }
  },
};

// ЗАПУСК КАЛЬКУЛЯТОРА
(function () {
  const startCalculator = () => {
    Loader.init();
    LanguageManager.init("langFrom", "langTo");
    LanguageManager.updateToOptions();
    PriceDisplay.init("priceDisplay");

    FileManager.init("fileInput", "fileDisplayContainer");
    FileManager.onAttachClick("attachSvg");
    FileManager.onFileSelected();

    PopupFileManager.init("fileInputPopup", "popupFileDisplayContainer");
    PopupFileManager.onAttachClick("attachSvgPopup");
    PopupFileManager.onFileSelected();

    ExclusiveCheckboxes.init("notaryCert", "notaryCopy", () =>
      PriceDisplay.update(),
    );
    ExclusiveCheckboxes.init("popupNotaryCert", "popupNotaryCopy", null);

    const updatePrice = () => PriceDisplay.update();

    LanguageManager.onFromChange(updatePrice);
    LanguageManager.onToChange(updatePrice);
    document
      .getElementById("documentType")
      ?.addEventListener("change", updatePrice);
    document
      .getElementById("pagesCount")
      ?.addEventListener("input", updatePrice);
    document.getElementById("urgent")?.addEventListener("change", updatePrice);
    document
      .getElementById("superUrgent")
      ?.addEventListener("change", updatePrice);

    PopupManager.register("sending", "sending");
    PopupManager.register("calculatePopup", "calculatePopup");
    PopupManager.closeOnOverlayClick("sending", () =>
      Validator.clearAllErrors(),
    );
    PopupManager.closeOnOverlayClick("calculatePopup");
    PopupManager.closeOnButtonClick("calculatePopup", ".success-popup__close");

    ConsentCheckbox.init("privacy", "#sending .sending__burtton");

    CalculatorUserForm.init({
      lastName: "surnameInput",
      firstName: "nameInput",
      email: "emailInput",
      phone: "phoneInput",
      message: "calcMessage",
      privacy: "privacy",
    });

    // Кнопка "Рассчитать"
    document
      .querySelector(".calculate-button")
      ?.addEventListener("click", () => {
        if (!LanguageManager.isValid()) {
          alert(
            "⚠️ Ошибка: перевод возможен только если один из языков — русский.",
          );
          return;
        }

        document.getElementById("sendingLang").value =
          CalculatorData.getLanguageFrom();
        document.getElementById("sendingLangTo").value =
          CalculatorData.getLanguageTo();
        document.querySelector("#sending .amendment__column select").value =
          CalculatorData.getDocumentType();
        document.querySelector(
          "#sending .amendment__column-other input",
        ).value = CalculatorData.getPagesCount();

        const popupNotaryCert = document.getElementById("popupNotaryCert");
        const popupNotaryCopy = document.getElementById("popupNotaryCopy");
        if (popupNotaryCert)
          popupNotaryCert.checked = CalculatorData.getNotaryCert();
        if (popupNotaryCopy)
          popupNotaryCopy.checked = CalculatorData.getNotaryCopy();

        const popupNonUrgent = document.getElementById("popupNonUrgent");
        const popupUrgent = document.getElementById("popupUrgent");
        const popupSuperUrgent = document.getElementById("popupSuperUrgent");

        if (CalculatorData.isUrgent()) {
          if (popupUrgent) popupUrgent.checked = true;
        } else if (CalculatorData.isSuperUrgent()) {
          if (popupSuperUrgent) popupSuperUrgent.checked = true;
        } else {
          if (popupNonUrgent) popupNonUrgent.checked = true;
        }

        const popupFrom = document.getElementById("sendingLang");
        const popupTo = document.getElementById("sendingLangTo");
        if (popupFrom && popupTo) {
          if (popupFrom.value === "russian") {
            Array.from(popupTo.options).forEach((opt) => {
              opt.style.display = opt.value === "russian" ? "none" : "block";
            });
            if (popupTo.value === "russian") popupTo.value = "";
          } else if (popupFrom.value) {
            Array.from(popupTo.options).forEach((opt) => {
              opt.style.display = opt.value === "russian" ? "block" : "none";
            });
            popupTo.value = "russian";
          }
        }

        PopupManager.open("sending");
      });

    // Отправка формы
    document
      .querySelector("#sending .sending__burtton")
      ?.addEventListener("click", async (e) => {
        e.preventDefault();

        const popupFrom = document.getElementById("sendingLang")?.value;
        const popupTo = document.getElementById("sendingLangTo")?.value;
        if (
          !popupFrom ||
          !popupTo ||
          (popupFrom !== "russian" && popupTo !== "russian") ||
          popupFrom === popupTo
        ) {
          alert(
            "⚠️ Ошибка: перевод возможен только если один из языков — русский.",
          );
          return;
        }

        if (!CalculatorUserForm.validate()) return;

        const orderData = {
          languageFrom: document.getElementById("sendingLang")?.value || "",
          languageTo: document.getElementById("sendingLangTo")?.value || "",
          documentType:
            document.querySelector("#sending .amendment__column select")
              ?.value || "personal",
          pagesCount: parseInt(
            document.querySelector("#sending .amendment__column-other input")
              ?.value || 1,
            10,
          ),
          notaryCert:
            document.getElementById("popupNotaryCert")?.checked || false,
          notaryCopy:
            document.getElementById("popupNotaryCopy")?.checked || false,
          urgent: document.getElementById("popupUrgent")?.checked || false,
          superUrgent:
            document.getElementById("popupSuperUrgent")?.checked || false,
          totalPrice: PriceCalculator.calculate(
            parseInt(
              document.querySelector("#sending .amendment__column-other input")
                ?.value || 1,
              10,
            ),
            document.querySelector("#sending .amendment__column select")
              ?.value || "personal",
            document.getElementById("popupNotaryCert")?.checked || false,
            document.getElementById("popupNotaryCopy")?.checked || false,
            document.getElementById("popupUrgent")?.checked || false,
            document.getElementById("popupSuperUrgent")?.checked || false,
          ),
        };

        const userData = CalculatorUserForm.getData();
        const file = PopupFileManager.getFile();

        const result = await OrderManager.submit(userData, orderData, file);

        if (result.success) {
          PopupFileManager.clearFile();
          FileManager.clearFile();
          CalculatorUserForm.clear();
          CalculatorUserForm.clearCalculator();
          PopupManager.close("sending");
          PopupManager.open("calculatePopup");
          Validator.clearAllErrors();
          PriceDisplay.update();
        } else {
          alert("Ошибка: " + (result.error || "Не удалось отправить заказ"));
        }
      });

    const popupFrom = document.getElementById("sendingLang");
    const popupTo = document.getElementById("sendingLangTo");

    if (popupFrom && popupTo) {
      const updatePopupLang = () => {
        if (popupFrom.value === "russian") {
          Array.from(popupTo.options).forEach((opt) => {
            opt.style.display = opt.value === "russian" ? "none" : "block";
          });
          if (popupTo.value === "russian") popupTo.value = "";
        } else if (popupFrom.value) {
          Array.from(popupTo.options).forEach((opt) => {
            opt.style.display = opt.value === "russian" ? "block" : "none";
          });
          popupTo.value = "russian";
        }
      };
      popupFrom.addEventListener("change", updatePopupLang);
      updatePopupLang();
    }

    updatePrice();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startCalculator);
  } else {
    startCalculator();
  }
})();

// Маска телефона для поля phoneInput в попапе
setTimeout(() => {
  const phoneInput = document.getElementById("phoneInput");
  if (phoneInput) {
    const formatPhone = (input) => {
      let numbers = input.value.replace(/\D/g, "");
      numbers = numbers.slice(0, 11);
      let formatted = "";
      if (numbers.length > 0) formatted = "+7";
      if (numbers.length > 1) formatted += "(" + numbers.substring(1, 4);
      if (numbers.length > 4) formatted += ") " + numbers.substring(4, 7);
      if (numbers.length > 7) formatted += "-" + numbers.substring(7, 9);
      if (numbers.length > 9) formatted += "-" + numbers.substring(9, 11);
      input.value = formatted;
    };

    phoneInput.addEventListener("input", () => formatPhone(phoneInput));
    phoneInput.addEventListener("focusout", () => formatPhone(phoneInput));
    formatPhone(phoneInput);
  }
}, 1000);
