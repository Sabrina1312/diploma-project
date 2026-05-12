// modules.js - полный файл со всеми модулями

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
// МОДУЛЬ 5: УПРАВЛЕНИЕ ЧЕКБОКСОМ СОГЛАСИЯ
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
// МОДУЛЬ 6: МАСКА ТЕЛЕФОНА
// ============================================================
const PhoneMask = {
  format(input) {
    if (!input) return;

    let numbers = input.value.replace(/\D/g, "");
    numbers = numbers.slice(0, 11);

    let formattedNumber = "";

    if (numbers.length > 0) {
      formattedNumber = "+7";
    }

    if (numbers.length > 1) {
      formattedNumber += "(" + numbers.substring(1, 4);
    }

    if (numbers.length > 4) {
      formattedNumber += ") " + numbers.substring(4, 7);
    }

    if (numbers.length > 7) {
      formattedNumber += " " + numbers.substring(7, 9);
    }

    if (numbers.length > 9) {
      formattedNumber += " " + numbers.substring(9, 11);
    }

    input.value = formattedNumber;
  },

  applyToInput(input) {
    if (!input) return;

    const handler = () => this.format(input);
    input.addEventListener("input", handler);
    input.addEventListener("focusout", handler);
    this.format(input);
  },

  init(selector = 'input[type="tel"]') {
    const phoneInputs = document.querySelectorAll(selector);
    phoneInputs.forEach((input) => this.applyToInput(input));
  },

  observe() {
    const observer = new MutationObserver(() => {
      this.init();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  },
};
