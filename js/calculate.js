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
// МОДУЛЬ 2: РАБОТА С ФАЙЛАМИ
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
const Preloader = {
  element: null,

  create() {
    if (this.element) return this.element;

    this.element = document.createElement("div");
    this.element.className = "ajax-preloader";
    this.element.innerHTML = `
      <div class="preloader-overlay">
        <div class="preloader-spinner"></div>
        <p>Отправка данных...</p>
      </div>
    `;
    document.body.appendChild(this.element);
    return this.element;
  },

  show() {
    const preloader = this.create();
    preloader.style.display = "block";
  },

  hide() {
    if (this.element) {
      this.element.style.display = "none";
    }
  },
};

// ============================================================
// МОДУЛЬ 5: HTTP ЗАПРОСЫ
// ============================================================
const HttpClient = {
  async post(url, data, headers = {}) {
    // Если URL пустой, не отправляем
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

  setTo(value) {
    if (this.toSelect) this.toSelect.value = value;
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
// МОДУЛЬ 8: УПРАВЛЕНИЕ ЧЕКБОКСАМИ (взаимоисключающие)
// ============================================================
const ExclusiveCheckboxes = {
  init(checkbox1, checkbox2, onChangeCallback) {
    const cb1 = document.getElementById(checkbox1);
    const cb2 = document.getElementById(checkbox2);

    if (cb1 && cb2) {
      cb1.onchange = () => {
        if (cb1.checked) cb2.checked = false;
        if (onChangeCallback) onChangeCallback();
      };
      cb2.onchange = () => {
        if (cb2.checked) cb1.checked = false;
        if (onChangeCallback) onChangeCallback();
      };
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

  enableButton() {
    if (this.targetButton) this.targetButton.disabled = false;
  },

  disableButton() {
    if (this.targetButton) this.targetButton.disabled = true;
  },
};

// ============================================================
// МОДУЛЬ 10: СИНХРОНИЗАЦИЯ ДАННЫХ
// ============================================================
const DataSync = {
  mappings: [],

  add(source, target) {
    this.mappings.push({ source, target });
    return this;
  },

  sync() {
    this.mappings.forEach(({ source, target }) => {
      if (source.element && target.element) {
        const value = source.getValue();
        target.setValue(value);
      }
    });
  },

  syncReverse() {
    this.mappings.forEach(({ source, target }) => {
      if (source.element && target.element) {
        const value = target.getValue();
        source.setValue(value);
      }
    });
  },
};

// Фабрика для создания источника/цели
const DataField = {
  fromElement(element, type = "value") {
    return {
      element: element,
      getValue: () => {
        if (type === "checked") return element.checked;
        return element.value;
      },
      setValue: (value) => {
        if (type === "checked") element.checked = value;
        else element.value = value;
      },
    };
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

  // Очистка только полей в попапе
  clear() {
    if (this.fields.lastName) this.fields.lastName.value = "";
    if (this.fields.firstName) this.fields.firstName.value = "";
    if (this.fields.email) this.fields.email.value = "";
    if (this.fields.phone) this.fields.phone.value = "";
    if (this.fields.message) this.fields.message.value = "";
    if (this.fields.privacy) this.fields.privacy.checked = false;

    // Деактивируем кнопку отправки
    const submitBtn = document.querySelector("#sending .sending__burtton");
    if (submitBtn) submitBtn.disabled = true;
  },

  // Очистка основной формы калькулятора
  clearCalculatorForm() {
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

    // Обновляем LanguageManager
    if (
      typeof LanguageManager !== "undefined" &&
      LanguageManager.updateToOptions
    ) {
      LanguageManager.updateToOptions();
    }

    // Обновляем цену
    const updatePriceEvent = new Event("change");
    if (langFrom) langFrom.dispatchEvent(updatePriceEvent);
    if (langTo) langTo.dispatchEvent(updatePriceEvent);
    if (documentType) documentType.dispatchEvent(updatePriceEvent);
    if (pagesCount) pagesCount.dispatchEvent(updatePriceEvent);
  },

  // Полная очистка (и попап, и калькулятор)
  clearAll() {
    this.clear();
    this.clearCalculatorForm();
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
// МОДУЛЬ 12: ЗАКАЗ (основная бизнес-логика)
// ============================================================
const OrderManager = {
  apiEndpoint: "",
  callbacks: {
    onBeforeSubmit: null,
    onAfterSubmit: null,
    onSuccess: null,
    onError: null,
  },

  config(endpoint) {
    this.apiEndpoint = endpoint;
    return this;
  },

  onBefore(callback) {
    this.callbacks.onBeforeSubmit = callback;
    return this;
  },

  onAfter(callback) {
    this.callbacks.onAfterSubmit = callback;
    return this;
  },

  onSuccess(callback) {
    this.callbacks.onSuccess = callback;
    return this;
  },

  onError(callback) {
    this.callbacks.onError = callback;
    return this;
  },

  collectData(userData, calculatorData, fileInfo) {
    return {
      ...userData,
      ...calculatorData,
      ...fileInfo,
      timestamp: new Date().toISOString(),
    };
  },

  async submit(userData, calculatorData, fileInfo) {
    if (this.callbacks.onBeforeSubmit) {
      const canProceed = this.callbacks.onBeforeSubmit();
      if (!canProceed) return { success: false, cancelled: true };
    }

    const formData = this.collectData(userData, calculatorData, fileInfo);

    if (this.callbacks.onAfterSubmit) {
      this.callbacks.onAfterSubmit(formData);
    }

    // ============================================================
    // РЕАЛЬНАЯ ОТПРАВКА ЗАКОММЕНТИРОВАНА
    // ДЛЯ ТЕСТИРОВАНИЯ ИСПОЛЬЗУЕТСЯ ИМИТАЦИЯ
    // ============================================================

    /* ===== РЕАЛЬНАЯ ОТПРАВКА (РАСКОММЕНТИРОВАТЬ ПОСЛЕ НАСТРОЙКИ СЕРВЕРА) =====
    Preloader.show();
    const result = await HttpClient.post(this.apiEndpoint, formData);
    Preloader.hide();
    ===== КОНЕЦ РЕАЛЬНОЙ ОТПРАВКИ ===== */

    // ===== ИМИТАЦИЯ ОТПРАВКИ (ДЛЯ ТЕСТИРОВАНИЯ) =====
    console.log("=== ИМИТАЦИЯ ОТПРАВКИ ДАННЫХ ===");
    console.log("Отправляемые данные:", formData);

    // Показываем прелоадер
    Preloader.show();

    // Имитация задержки сервера
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Скрываем прелоадер
    Preloader.hide();

    // Имитация успешного ответа
    const result = {
      success: true,
      data: { message: "Данные успешно отправлены (имитация)" },
    };
    console.log("=== ИМИТАЦИЯ ЗАВЕРШЕНА ===");
    // ===== КОНЕЦ ИМИТАЦИИ =====

    if (result.success) {
      if (this.callbacks.onSuccess) this.callbacks.onSuccess(result.data);
    } else {
      if (this.callbacks.onError) this.callbacks.onError(result.error);
    }

    return result;
  },
};

// ============================================================
// МОДУЛЬ 13: КОЛЛЕКТОР ДАННЫХ КАЛЬКУЛЯТОРА
// ============================================================
const CalculatorDataCollector = {
  elements: {},

  register(key, element) {
    this.elements[key] = element;
    return this;
  },

  getValue(key) {
    const el = this.elements[key];
    if (!el) return null;
    if (el.type === "checkbox" || el.type === "radio") return el.checked;
    return el.value;
  },

  getAll() {
    const data = {};
    Object.keys(this.elements).forEach((key) => {
      data[key] = this.getValue(key);
    });
    return data;
  },

  getTariff() {
    if (this.elements.urgent?.checked) return "urgent";
    if (this.elements.superUrgent?.checked) return "superUrgent";
    return "nonUrgent";
  },
};

// ============================================================
// МОДУЛЬ 14: ОТОБРАЖЕНИЕ ЦЕНЫ
// ============================================================
const PriceDisplay = {
  element: null,

  init(elementId) {
    this.element = document.getElementById(elementId);
    return this;
  },

  update(price) {
    if (this.element) {
      this.element.textContent = PriceCalculator.formatPrice(price);
    }
  },

  reset() {
    if (this.element) {
      this.element.textContent = "0 РУБ.";
    }
  },
};

// ============================================================
// МОДУЛЬ 15: ОЧИСТКА ОСНОВНОЙ ФОРМЫ КАЛЬКУЛЯТОРА
// ============================================================
const CalculatorForm = {
  clear() {
    // Сбрасываем селекты на значения по умолчанию
    const langFrom = document.getElementById("langFrom");
    const langTo = document.getElementById("langTo");
    const documentType = document.getElementById("documentType");
    const pagesCount = document.getElementById("pagesCount");

    if (langFrom) langFrom.value = "english";
    if (langTo) langTo.value = "russian";
    if (documentType) documentType.value = "personal";
    if (pagesCount) pagesCount.value = "1";

    // Снимаем чекбоксы
    const notaryCert = document.getElementById("notaryCert");
    const notaryCopy = document.getElementById("notaryCopy");
    if (notaryCert) notaryCert.checked = false;
    if (notaryCopy) notaryCopy.checked = false;

    // Сбрасываем радио-кнопки
    const nonUrgent = document.getElementById("nonUrgent");
    const urgent = document.getElementById("urgent");
    const superUrgent = document.getElementById("superUrgent");
    if (nonUrgent) nonUrgent.checked = true;
    if (urgent) urgent.checked = false;
    if (superUrgent) superUrgent.checked = false;

    // Обновляем отображение цены
    const updatePriceEvent = new Event("change");
    if (langFrom) langFrom.dispatchEvent(updatePriceEvent);
    if (langTo) langTo.dispatchEvent(updatePriceEvent);

    // Очищаем прикреплённый файл в основной форме (если есть)
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.value = "";
  },
};

// ============================================================
// ЗАПУСК ПРИЛОЖЕНИЯ (сборка всех модулей)
// ============================================================
(function () {
  // Ждём загрузку DOM
  const startApp = () => {
    // 1. Настройка языков
    LanguageManager.init("langFrom", "langTo");
    LanguageManager.updateToOptions();
    LanguageManager.onFromChange(() => {
      const total = PriceCalculator.calculate(
        parseInt(document.getElementById("pagesCount")?.value || 0, 10),
        document.getElementById("documentType")?.value || "personal",
        document.getElementById("notaryCert")?.checked,
        document.getElementById("notaryCopy")?.checked,
        document.getElementById("urgent")?.checked,
        document.getElementById("superUrgent")?.checked,
      );
      PriceDisplay.init("priceDisplay").update(total);
    });
    LanguageManager.onToChange(() => {
      const total = PriceCalculator.calculate(
        parseInt(document.getElementById("pagesCount")?.value || 0, 10),
        document.getElementById("documentType")?.value || "personal",
        document.getElementById("notaryCert")?.checked,
        document.getElementById("notaryCopy")?.checked,
        document.getElementById("urgent")?.checked,
        document.getElementById("superUrgent")?.checked,
      );
      PriceDisplay.init("priceDisplay").update(total);
    });

    // 2. Настройка калькулятора цены
    const updatePrice = () => {
      if (!LanguageManager.isValid()) {
        PriceDisplay.init("priceDisplay").reset();
        return;
      }

      const pages = parseInt(
        document.getElementById("pagesCount")?.value || 0,
        10,
      );
      const total = PriceCalculator.calculate(
        pages,
        document.getElementById("documentType")?.value || "personal",
        document.getElementById("notaryCert")?.checked,
        document.getElementById("notaryCopy")?.checked,
        document.getElementById("urgent")?.checked,
        document.getElementById("superUrgent")?.checked,
      );
      PriceDisplay.init("priceDisplay").update(total);
    };

    // Навешиваем события на калькулятор
    document
      .getElementById("documentType")
      ?.addEventListener("change", updatePrice);
    document
      .getElementById("pagesCount")
      ?.addEventListener("input", updatePrice);
    document
      .getElementById("notaryCert")
      ?.addEventListener("change", updatePrice);
    document
      .getElementById("notaryCopy")
      ?.addEventListener("change", updatePrice);
    document.getElementById("urgent")?.addEventListener("change", updatePrice);
    document
      .getElementById("superUrgent")
      ?.addEventListener("change", updatePrice);

    // 3. Настройка файлов
    FileManager.init("fileInput", "fileDisplayContainer");
    FileManager.onAttachClick("attachSvg");
    FileManager.onFileSelected();

    // 4. Настройка попапов
    PopupManager.register("sending", "sending").register(
      "calculatePopup",
      "calculatePopup",
    );
    PopupManager.closeOnOverlayClick("sending", () =>
      Validator.clearAllErrors(),
    );
    PopupManager.closeOnOverlayClick("calculatePopup");
    PopupManager.closeOnButtonClick("calculatePopup", ".success-popup__close");

    // 5. Настройка согласия
    ConsentCheckbox.init("privacy", "#sending .sending__burtton");

    // 6. Настройка формы пользователя
    UserForm.init({
      lastName: "surnameInput",
      firstName: "nameInput",
      email: "emailInput",
      phone: "phoneInput",
      message: "calcMessage",
      privacy: "privacy",
    });

    // 7. Настройка коллектора данных калькулятора
    const calculatorData = CalculatorDataCollector.register(
      "languageFrom",
      document.getElementById("langFrom"),
    )
      .register("languageTo", document.getElementById("langTo"))
      .register("documentType", document.getElementById("documentType"))
      .register("pagesCount", document.getElementById("pagesCount"))
      .register("notaryCert", document.getElementById("notaryCert"))
      .register("notaryCopy", document.getElementById("notaryCopy"));

    // 8. Настройка синхронизации данных с попапом
    const syncFields = [
      { from: "langFrom", to: "sendingLang" },
      { from: "langTo", to: "sendingLangTo" },
      { from: "documentType", to: "#sending .amendment__column select" },
      { from: "pagesCount", to: "#sending .amendment__column-other input" },
      {
        from: "notaryCert",
        to: "#sending .amendment__radio:first-child input",
      },
      { from: "notaryCopy", to: "#sending .amendment__radio:last-child input" },
      { from: "nonUrgent", to: "#sending .amendment__radio input[value='0']" },
      { from: "urgent", to: "#sending .amendment__radio_type_center input" },
      { from: "superUrgent", to: "#sending .amendment__radio_type_end input" },
    ];

    const sync = DataSync;
    syncFields.forEach(({ from, to }) => {
      const sourceEl = document.getElementById(from);
      const targetEl =
        document.getElementById(to) || document.querySelector(to);
      if (sourceEl && targetEl) {
        const type = sourceEl.type === "checkbox" ? "checked" : "value";
        sync.add(
          DataField.fromElement(sourceEl, type),
          DataField.fromElement(targetEl, type),
        );
      }
    });

    // 9. Кнопка отправки в основном калькуляторе
    document
      .querySelector(".calculate-button")
      ?.addEventListener("click", () => {
        if (!LanguageManager.isValid()) {
          alert(
            "⚠️ Ошибка: перевод возможен только если один из языков — русский.",
          );
          return;
        }
        sync.sync();
        PopupManager.open("sending");
      });

    // 10. Настройка отправки заказа (используется имитация)
    OrderManager.config("")
      .onBefore(() => UserForm.validate())
      .onSuccess(() => {
        FileManager.clearFile();
        UserForm.clear(); // Очищаем поля в попапе
        UserForm.clearCalculatorForm(); // Очищаем основную форму калькулятора
        PopupManager.close("sending");
        PopupManager.open("calculatePopup");
        Validator.clearAllErrors();
      })
      .onError((error) => {
        alert(`Ошибка отправки:\n${error}\n\nПожалуйста, попробуйте позже.`);
      });

    // 11. Кнопка отправки в попапе
    document
      .querySelector("#sending .sending__burtton")
      ?.addEventListener("click", async (e) => {
        e.preventDefault();

        const userData = UserForm.getData();
        const calculatorFormData = calculatorData.getAll();

        const orderData = {
          user: userData,
          calculator: {
            ...calculatorFormData,
            tariff: calculatorData.getTariff(),
            totalPrice: PriceDisplay.element?.textContent || "0 РУБ.",
          },
          file: FileManager.hasFile()
            ? {
                name: FileManager.getFile()?.name,
                size: (FileManager.getFile()?.size / 1024).toFixed(2) + " KB",
              }
            : null,
        };

        // Отправка с имитацией
        const result = await OrderManager.submit(userData, orderData, {});

        if (!result.success && !result.cancelled) {
          console.log("Отправка не удалась");
        }
      });

    // Первоначальный расчёт цены
    updatePrice();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startApp);
  } else {
    startApp();
  }
})();
