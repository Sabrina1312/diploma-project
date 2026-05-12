// ============================================================
// СТРАНИЦА КОНТАКТОВ
// ============================================================

(function () {
  // ============================================================
  // 1. ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ ФОРМЫ
  // ============================================================
  const form = document.querySelector(".contacts__form");
  const submitButton = document.querySelector(".contacts__button");

  // ============================================================
  // 2. НАСТРОЙКА ФАЙЛОВ
  // ============================================================
  FileManager.init("fileInput", "fileDisplayContainer");
  FileManager.onAttachClick("attachSvg");
  FileManager.onFileSelected();

  // ============================================================
  // 3. НАСТРОЙКА ПОПАПА
  // ============================================================
  PopupManager.register("contactsPopup", "contactsPopup");
  PopupManager.closeOnOverlayClick("contactsPopup");
  PopupManager.closeOnButtonClick("contactsPopup", ".success-popup__close");
  PopupManager.close("contactsPopup");

  // ============================================================
  // 4. НАСТРОЙКА КНОПКИ ОТПРАВКИ (через ConsentCheckbox)
  // ============================================================
  ConsentCheckbox.init("privacy", ".contacts__button");

  // ============================================================
  // 5. НАСТРОЙКА МАСКИ ТЕЛЕФОНА
  // ============================================================
  PhoneMask.init();

  // ============================================================
  // 6. ВАЛИДАЦИЯ ФОРМЫ
  // ============================================================
  function validateContactsForm() {
    let isValid = true;
    Validator.clearAllErrors();

    const lastname = document.getElementById("lastname");
    const firstname = document.getElementById("firstname");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    // Фамилия
    if (!lastname?.value.trim()) {
      isValid = false;
      Validator.showError(lastname, 'Пожалуйста, заполните поле "Фамилия"');
    }

    // Имя
    if (!firstname?.value.trim()) {
      isValid = false;
      Validator.showError(firstname, 'Пожалуйста, заполните поле "Имя"');
    }

    // Email
    const emailValue = email?.value.trim() || "";
    if (!emailValue) {
      isValid = false;
      Validator.showError(email, 'Пожалуйста, заполните поле "Email"');
    } else if (!Validator.email(emailValue)) {
      isValid = false;
      Validator.showError(email, "Введите корректный email");
    }

    // Телефон
    const phoneValue = phone?.value.trim() || "";
    if (!phoneValue) {
      isValid = false;
      Validator.showError(phone, 'Пожалуйста, заполните поле "Номер телефона"');
    } else if (!Validator.phone(phoneValue)) {
      isValid = false;
      Validator.showError(
        phone,
        "Введите корректный номер телефона (10-11 цифр)",
      );
    }

    // Тема
    if (!subject?.value) {
      isValid = false;
      Validator.showError(subject, "Пожалуйста, выберите тему обращения");
    }

    // Сообщение
    if (!message?.value.trim()) {
      isValid = false;
      Validator.showError(message, 'Пожалуйста, заполните поле "Сообщение"');
    }

    return isValid;
  }

  // ============================================================
  // 7. СБОР ДАННЫХ
  // ============================================================
  function collectFormData() {
    return {
      lastname: document.getElementById("lastname")?.value.trim() || "",
      firstname: document.getElementById("firstname")?.value.trim() || "",
      email: document.getElementById("email")?.value.trim() || "",
      phone: document.getElementById("phone")?.value.trim() || "",
      subject: document.getElementById("subject")?.value || "",
      message: document.getElementById("message")?.value.trim() || "",
      privacy: document.getElementById("privacy")?.checked || false,
      fileName: FileManager.hasFile() ? FileManager.getFile()?.name : null,
      fileSize: FileManager.hasFile()
        ? (FileManager.getFile()?.size / 1024).toFixed(2) + " KB"
        : null,
      timestamp: new Date().toISOString(),
      page: "contacts",
    };
  }

  // ============================================================
  // 8. ОЧИСТКА ФОРМЫ
  // ============================================================
  function clearForm() {
    const fields = [
      "lastname",
      "firstname",
      "email",
      "phone",
      "subject",
      "message",
    ];
    fields.forEach((id) => {
      const field = document.getElementById(id);
      if (field) field.value = "";
    });

    // Сбрасываем чекбокс
    const privacy = document.getElementById("privacy");
    if (privacy) privacy.checked = false;

    // Очищаем файл
    FileManager.clearFile();

    // Очищаем ошибки
    Validator.clearAllErrors();

    // Кнопка станет неактивной через ConsentCheckbox (чекбокс снят)
  }

  // ============================================================
  // 9. ОТПРАВКА ДАННЫХ (ИМИТАЦИЯ)
  // ============================================================
  async function sendData(formData) {
    console.log("=== ИМИТАЦИЯ ОТПРАВКИ КОНТАКТЫ ===");
    console.log("Данные:", formData);

    Preloader.show();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    Preloader.hide();

    return { success: true };
  }

  // ============================================================
  // 10. ОСНОВНАЯ ФУНКЦИЯ
  // ============================================================
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateContactsForm()) return;

    const formData = collectFormData();
    const result = await sendData(formData);

    if (result.success) {
      clearForm();
      PopupManager.open("contactsPopup");
    } else {
      alert("Ошибка отправки. Попробуйте позже.");
    }
  }

  // ============================================================
  // 11. ЖИВАЯ ВАЛИДАЦИЯ
  // ============================================================
  function setupLiveValidation() {
    const emailField = document.getElementById("email");
    const phoneField = document.getElementById("phone");

    emailField?.addEventListener("blur", () => {
      const email = emailField.value.trim();
      if (email && !Validator.email(email)) {
        Validator.showError(emailField, "Введите корректный email");
      } else {
        Validator.removeError(emailField);
      }
    });

    phoneField?.addEventListener("blur", () => {
      const phone = phoneField.value.trim();
      if (phone && !Validator.phone(phone)) {
        Validator.showError(phoneField, "Введите корректный номер");
      } else {
        Validator.removeError(phoneField);
      }
    });
  }

  // ============================================================
  // 12. ИНИЦИАЛИЗАЦИЯ
  // ============================================================
  function init() {
    if (form) form.addEventListener("submit", handleSubmit);
    setupLiveValidation();
    // Маска телефона уже инициализирована в пункте 5
    // PhoneMask.init() уже вызван выше
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
