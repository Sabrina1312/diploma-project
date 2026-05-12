// ============================================================
// МОДУЛЬ 1: ВАЛИДАЦИЯ
// ============================================================
const Validator = {
  email(email) {
    const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    return re.test(email);
  },

  phone(phone) {
    const numbers = phone.replace(/\D/g, "");
    return numbers.length >= 10 && numbers.length <= 11;
  },

  showError(field, message) {
    if (!field) return;
    field.classList.add("error-border");
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    if (field.parentNode) {
      field.parentNode.style.position = "relative";
      field.parentNode.appendChild(errorDiv);
    }
  },

  removeError(field) {
    if (!field) return;
    field.classList.remove("error-border");
    const existingError = field.parentNode?.querySelector(".error-message");
    if (existingError) existingError.remove();
  },

  clearAllErrors() {
    document.querySelectorAll(".error-message").forEach((el) => el.remove());
    document
      .querySelectorAll(".error-border")
      .forEach((el) => el.classList.remove("error-border"));
  },
};

// ============================================================
// МОДУЛЬ 2: РАБОТА С ФАЙЛАМИ (ОСНОВНАЯ ФОРМА)
// ============================================================
const FileManager = {
  attachedFile: null,
  fileInput: null,
  displayContainer: null,
  onFileChangeCallback: null,

  init(fileInputId, displayContainerId) {
    this.fileInput = document.getElementById(fileInputId);
    this.displayContainer = document.getElementById(displayContainerId);
    return this;
  },

  getFile() {
    return this.attachedFile;
  },

  hasFile() {
    return this.attachedFile !== null;
  },

  updateDisplay() {
    if (!this.displayContainer) return;

    if (this.attachedFile) {
      const fileName = this.attachedFile.name;
      const fileSize = (this.attachedFile.size / 1024).toFixed(2);
      this.displayContainer.innerHTML = `
        <span class="file-info">📎 ${fileName} (${fileSize} КБ)</span>
        <button type="button" class="remove-file-btn">🗑️</button>
      `;
      this.displayContainer.style.display = "flex";

      const removeBtn = this.displayContainer.querySelector(".remove-file-btn");
      if (removeBtn) {
        removeBtn.onclick = () => this.removeFile();
      }
    } else {
      this.displayContainer.style.display = "none";
      this.displayContainer.innerHTML = "";
    }
  },

  removeFile() {
    this.attachedFile = null;
    if (this.fileInput) this.fileInput.value = "";
    this.updateDisplay();
    if (this.onFileChangeCallback) this.onFileChangeCallback(null);
  },

  clearFile() {
    this.attachedFile = null;
    if (this.fileInput) this.fileInput.value = "";
    if (this.displayContainer) {
      this.displayContainer.style.display = "none";
      this.displayContainer.innerHTML = "";
    }
  },

  onFileSelected(callback) {
    this.onFileChangeCallback = callback;
    if (this.fileInput) {
      this.fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          this.attachedFile = file;
          this.updateDisplay();
          if (callback) callback(file);
        }
      };
    }
  },

  onAttachClick(attachElementId) {
    const attachElement = document.getElementById(attachElementId);
    if (attachElement && this.fileInput) {
      attachElement.onclick = (e) => {
        e.preventDefault();
        this.fileInput.click();
      };
    }
  },
};

// ============================================================
// МОДУЛЬ 2.1: РАБОТА С ФАЙЛАМИ (ПОПАП)
// ============================================================
const PopupFileManager = {
  attachedFile: null,
  fileInput: null,
  displayContainer: null,
  onFileChangeCallback: null,

  init(fileInputId, displayContainerId) {
    this.fileInput = document.getElementById(fileInputId);
    this.displayContainer = document.getElementById(displayContainerId);
    return this;
  },

  getFile() {
    return this.attachedFile;
  },

  hasFile() {
    return this.attachedFile !== null;
  },

  updateDisplay() {
    if (!this.displayContainer) return;

    if (this.attachedFile) {
      const fileName = this.attachedFile.name;
      const fileSize = (this.attachedFile.size / 1024).toFixed(2);
      this.displayContainer.innerHTML = `
        <span class="file-info">📎 ${fileName} (${fileSize} КБ)</span>
        <button type="button" class="remove-file-btn">🗑️</button>
      `;
      this.displayContainer.style.display = "flex";

      const removeBtn = this.displayContainer.querySelector(".remove-file-btn");
      if (removeBtn) {
        removeBtn.onclick = () => this.removeFile();
      }
    } else {
      this.displayContainer.style.display = "none";
      this.displayContainer.innerHTML = "";
    }
  },

  removeFile() {
    this.attachedFile = null;
    if (this.fileInput) this.fileInput.value = "";
    this.updateDisplay();
    if (this.onFileChangeCallback) this.onFileChangeCallback(null);
  },

  clearFile() {
    this.attachedFile = null;
    if (this.fileInput) this.fileInput.value = "";
    if (this.displayContainer) {
      this.displayContainer.style.display = "none";
      this.displayContainer.innerHTML = "";
    }
  },

  onFileSelected(callback) {
    this.onFileChangeCallback = callback;
    if (this.fileInput) {
      this.fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          this.attachedFile = file;
          this.updateDisplay();
          if (callback) callback(file);
        }
      };
    }
  },

  onAttachClick(attachElementId) {
    const attachElement = document.getElementById(attachElementId);
    if (attachElement && this.fileInput) {
      attachElement.onclick = (e) => {
        e.preventDefault();
        this.fileInput.click();
      };
    }
  },
};

// ============================================================
// МОДУЛЬ 3: УПРАВЛЕНИЕ ПОПАПАМИ
// ============================================================
const PopupManager = {
  popups: {},

  register(name, elementId) {
    this.popups[name] = document.getElementById(elementId);
    return this;
  },

  open(name) {
    const popup = this.popups[name];
    if (popup) {
      popup.classList.add("success-popup_opened");
      document.body.style.overflow = "hidden";
    }
  },

  close(name) {
    const popup = this.popups[name];
    if (popup) {
      popup.classList.remove("success-popup_opened");
      document.body.style.overflow = "";
    }
  },

  isOpen(name) {
    const popup = this.popups[name];
    return popup ? popup.classList.contains("success-popup_opened") : false;
  },

  closeOnOverlayClick(name, onCloseCallback) {
    const popup = this.popups[name];
    if (popup) {
      popup.addEventListener("click", (e) => {
        if (e.target === popup) {
          this.close(name);
          if (onCloseCallback) onCloseCallback();
        }
      });
    }
  },

  closeOnButtonClick(name, buttonSelector, onCloseCallback) {
    const popup = this.popups[name];
    const button = popup?.querySelector(buttonSelector);
    if (button) {
      button.addEventListener("click", () => {
        this.close(name);
        if (onCloseCallback) onCloseCallback();
      });
    }
  },
};

// ============================================================
// МОДУЛЬ 4: ПРЕЛОАДЕР
// ============================================================
const Loader = {
  element: null,

  init() {
    this.element = document.getElementById("loader");
    return this;
  },

  show() {
    if (this.element) {
      this.element.classList.add("loader-visible");
    }
  },

  hide() {
    if (this.element) {
      this.element.classList.remove("loader-visible");
    }
  },
};

// ============================================================
// МОДУЛЬ 5: HTTP ЗАПРОСЫ
// ============================================================
const HttpClient = {
  async post(url, data, headers = {}) {
    if (!url) {
      console.warn("Отправка отключена: endpoint не настроен");
      return { success: false, error: "Endpoint не настроен" };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true, data: await response.json() };
    } catch (error) {
      console.error("Ошибка:", error);
      return { success: false, error: error.message };
    }
  },

  async get(url) {
    if (!url) {
      console.warn("Запрос отключён: endpoint не настроен");
      return { success: false, error: "Endpoint не настроен" };
    }

    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return { success: true, data: await response.json() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================================
// МОДУЛЬ 6: КАЛЬКУЛЯТОР ЦЕН
// ============================================================
const PriceCalculator = {
  config: {
    pricePerPage: 700,
    educationSurcharge: 100,
    legalMedicalOtherSurcharge: 200,
    notaryCertPrice: 800,
    notaryCopyPricePerPage: 200,
    urgentPrice: 500,
    superUrgentPrice: 1000,
  },

  setConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  },

  calculate(
    pages,
    docType,
    notaryCertChecked,
    notaryCopyChecked,
    urgentChecked,
    superUrgentChecked,
  ) {
    let total = pages * this.config.pricePerPage;

    if (docType === "education") total += this.config.educationSurcharge;
    else if (["legal", "medical", "other"].includes(docType)) {
      total += this.config.legalMedicalOtherSurcharge;
    }

    if (notaryCertChecked) total += this.config.notaryCertPrice;
    if (notaryCopyChecked) total += pages * this.config.notaryCopyPricePerPage;
    if (urgentChecked) total += this.config.urgentPrice;
    else if (superUrgentChecked) total += this.config.superUrgentPrice;

    return total;
  },

  formatPrice(price) {
    return price.toLocaleString("ru-RU") + " РУБ.";
  },
};

// ============================================================
// МОДУЛЬ 7: УПРАВЛЕНИЕ ЯЗЫКАМИ
// ============================================================
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

// ============================================================
// МОДУЛЬ 8: УПРАВЛЕНИЕ ВЗАИМОИСКЛЮЧАЮЩИМИ ЧЕКБОКСАМИ
// ============================================================
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

// ============================================================
// МОДУЛЬ 9: УПРАВЛЕНИЕ ЧЕКБОКСОМ СОГЛАСИЯ
// ============================================================
const ConsentCheckbox = {
  checkbox: null,
  targetButton: null,

  init(checkboxId, buttonSelector) {
    this.checkbox = document.getElementById(checkboxId);
    this.targetButton = document.querySelector(buttonSelector);

    if (this.checkbox && this.targetButton) {
      this.checkbox.onchange = () => {
        this.targetButton.disabled = !this.checkbox.checked;
      };
      this.targetButton.disabled = true;
    }

    return this;
  },

  isChecked() {
    return this.checkbox?.checked || false;
  },
};

// ============================================================
// МОДУЛЬ 10: СБОР ДАННЫХ КАЛЬКУЛЯТОРА
// ============================================================
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

  getTariff() {
    if (document.getElementById("urgent")?.checked) return "urgent";
    if (document.getElementById("superUrgent")?.checked) return "superUrgent";
    return "nonUrgent";
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
      tariff: this.getTariff(),
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

// ============================================================
// МОДУЛЬ 11: ФОРМА ПОЛЬЗОВАТЕЛЯ
// ============================================================
const UserForm = {
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

    const submitBtn = document.querySelector("#sending .sending__burtton");
    if (submitBtn) submitBtn.disabled = true;
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

    if (LanguageManager.updateToOptions) {
      LanguageManager.updateToOptions();
    }
  },

  validate() {
    let isValid = true;
    Validator.clearAllErrors();

    const lastName = this.fields.lastName?.value.trim() || "";
    if (!lastName) {
      isValid = false;
      Validator.showError(
        this.fields.lastName,
        'Пожалуйста, заполните поле "Фамилия"',
      );
    }

    const firstName = this.fields.firstName?.value.trim() || "";
    if (!firstName) {
      isValid = false;
      Validator.showError(
        this.fields.firstName,
        'Пожалуйста, заполните поле "Имя"',
      );
    }

    const email = this.fields.email?.value.trim() || "";
    if (!email) {
      isValid = false;
      Validator.showError(
        this.fields.email,
        'Пожалуйста, заполните поле "Email"',
      );
    } else if (!Validator.email(email)) {
      isValid = false;
      Validator.showError(this.fields.email, "Введите корректный email");
    }

    const phone = this.fields.phone?.value.trim() || "";
    if (!phone) {
      isValid = false;
      Validator.showError(
        this.fields.phone,
        'Пожалуйста, заполните поле "Номер телефона"',
      );
    } else if (!Validator.phone(phone)) {
      isValid = false;
      Validator.showError(
        this.fields.phone,
        "Введите корректный номер телефона",
      );
    }

    if (!this.fields.privacy?.checked) {
      isValid = false;
      const privacyLabel = this.fields.privacy?.closest(".sending__privacy");
      if (privacyLabel && !privacyLabel.querySelector(".error-message")) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.style.cssText =
          "position: relative; text-align: center; margin-top: 10px;";
        errorDiv.textContent =
          "Пожалуйста, примите условия Политики конфиденциальности";
        privacyLabel.appendChild(errorDiv);
      }
    }

    return isValid;
  },
};

// ============================================================
// МОДУЛЬ 12: ОТОБРАЖЕНИЕ ЦЕНЫ
// ============================================================
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

// ============================================================
// МОДУЛЬ 13: ЗАКАЗ (отправка)
// ============================================================
const OrderManager = {
  async submit(userData, calculatorData, file) {
    console.log("=== ОТПРАВКА ДАННЫХ ===");
    console.log("Данные пользователя:", userData);
    console.log("Данные калькулятора:", calculatorData);
    console.log("Файл:", file);

    Loader.show();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    Loader.hide();

    const orderData = {
      user: userData,
      order: {
        ...calculatorData,
        totalPrice: PriceCalculator.formatPrice(calculatorData.totalPrice),
      },
      file: file
        ? {
            name: file.name,
            size: (file.size / 1024).toFixed(2) + " KB",
          }
        : null,
      timestamp: new Date().toISOString(),
    };

    console.log("Отправляемые данные:", orderData);
    console.log("=== ОТПРАВКА ЗАВЕРШЕНА ===");

    return { success: true };
  },
};

// ============================================================
// ЗАПУСК ПРИЛОЖЕНИЯ
// ============================================================
(function () {
  const startApp = () => {
    // Инициализация
    Loader.init();
    LanguageManager.init("langFrom", "langTo");
    LanguageManager.updateToOptions();
    PriceDisplay.init("priceDisplay");

    // Инициализация файлов для основной формы
    FileManager.init("fileInput", "fileDisplayContainer");
    FileManager.onAttachClick("attachSvg");
    FileManager.onFileSelected();

    // Инициализация файлов для попапа
    PopupFileManager.init("fileInputPopup", "popupFileDisplayContainer");
    PopupFileManager.onAttachClick("attachSvgPopup");
    PopupFileManager.onFileSelected();

    // Взаимоисключающие чекбоксы
    ExclusiveCheckboxes.init("notaryCert", "notaryCopy", () =>
      PriceDisplay.update(),
    );
    ExclusiveCheckboxes.init("popupNotaryCert", "popupNotaryCopy", null);

    // Функция обновления цены
    const updatePrice = () => PriceDisplay.update();

    // События для обновления цены
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

    // Попапы
    PopupManager.register("sending", "sending").register(
      "calculatePopup",
      "calculatePopup",
    );
    PopupManager.closeOnOverlayClick("sending", () =>
      Validator.clearAllErrors(),
    );
    PopupManager.closeOnOverlayClick("calculatePopup");
    PopupManager.closeOnButtonClick("calculatePopup", ".success-popup__close");

    // Чекбокс согласия
    ConsentCheckbox.init("privacy", "#sending .sending__burtton");

    // Форма пользователя
    UserForm.init({
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

        // Заполняем попап данными из калькулятора
        document.getElementById("sendingLang").value =
          CalculatorData.getLanguageFrom();
        document.getElementById("sendingLangTo").value =
          CalculatorData.getLanguageTo();
        document.querySelector("#sending .amendment__column select").value =
          CalculatorData.getDocumentType();
        document.querySelector(
          "#sending .amendment__column-other input",
        ).value = CalculatorData.getPagesCount();

        // Чекбоксы в попапе
        const popupNotaryCert = document.getElementById("popupNotaryCert");
        const popupNotaryCopy = document.getElementById("popupNotaryCopy");
        if (popupNotaryCert)
          popupNotaryCert.checked = CalculatorData.getNotaryCert();
        if (popupNotaryCopy)
          popupNotaryCopy.checked = CalculatorData.getNotaryCopy();

        // Радио-кнопки в попапе
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

        // Обновляем отображение языка в попапе
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

        // Проверяем язык в попапе
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

        // Валидация формы пользователя
        if (!UserForm.validate()) return;

        // Собираем данные из попапа
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
        };

        // Рассчитываем цену
        orderData.totalPrice = PriceCalculator.calculate(
          orderData.pagesCount,
          orderData.documentType,
          orderData.notaryCert,
          orderData.notaryCopy,
          orderData.urgent,
          orderData.superUrgent,
        );

        if (orderData.urgent) orderData.tariff = "urgent";
        else if (orderData.superUrgent) orderData.tariff = "superUrgent";
        else orderData.tariff = "nonUrgent";

        const userData = UserForm.getData();
        // Берем файл из попапа
        const file = PopupFileManager.getFile();

        const result = await OrderManager.submit(userData, orderData, file);

        if (result.success) {
          PopupFileManager.clearFile();
          FileManager.clearFile();
          UserForm.clear();
          UserForm.clearCalculator();
          PopupManager.close("sending");
          PopupManager.open("calculatePopup");
          Validator.clearAllErrors();
          PriceDisplay.update();
        }
      });

    // Инициализация для попапа (языки)
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

    // Первоначальный расчет
    updatePrice();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startApp);
  } else {
    startApp();
  }
})();

// ============================================================
// МАСКА ТЕЛЕФОНА
// ============================================================
(function initPhoneMask() {
  function formatPhone(input) {
    if (!input) return;
    let numbers = input.value.replace(/\D/g, "");
    numbers = numbers.slice(0, 11);
    let formatted = "";
    if (numbers.length > 0) formatted = "+7";
    if (numbers.length > 1) formatted += "(" + numbers.substring(1, 4);
    if (numbers.length > 4) formatted += ") " + numbers.substring(4, 7);
    if (numbers.length > 7) formatted += "-" + numbers.substring(7, 9);
    if (numbers.length > 9) formatted += "-" + numbers.substring(9, 11);
    input.value = formatted;
  }

  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach((input) => {
    input.addEventListener("input", () => formatPhone(input));
    input.addEventListener("focusout", () => formatPhone(input));
    formatPhone(input);
  });
})();
