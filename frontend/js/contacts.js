// ============================================================
// ОТПРАВКА ОТЗЫВОВ И ЗАЯВОК (для страницы contacts.html)
// ============================================================

(function () {
  const form = document.querySelector(".contacts__form");
  if (!form) return;

  const submitButton = document.querySelector(".contacts__button");

  // Инициализация
  if (typeof PhoneMask !== "undefined") PhoneMask.init("#phone");

  if (typeof FileManager !== "undefined") {
    FileManager.init("fileInput", "fileDisplayContainer");
    FileManager.onAttachClick("attachSvg");
    FileManager.onFileSelected();
  }

  if (typeof ConsentCheckbox !== "undefined") {
    ConsentCheckbox.init("privacy", ".contacts__button");
  }

  // Валидация формы
  function validateForm() {
    let isValid = true;
    if (typeof Validator !== "undefined") Validator.clearAllErrors();

    const lastName = document.getElementById("lastname");
    const firstName = document.getElementById("firstname");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");
    const privacy = document.getElementById("privacy");

    function showError(field, msg) {
      if (!field) return;
      field.classList.add("error-border");
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.textContent = msg;
      if (field.parentNode) {
        field.parentNode.style.position = "relative";
        field.parentNode.appendChild(errorDiv);
      }
    }

    if (!lastName?.value.trim()) {
      isValid = false;
      showError(lastName, 'Заполните поле "Фамилия"');
    }

    if (!firstName?.value.trim()) {
      isValid = false;
      showError(firstName, 'Заполните поле "Имя"');
    }

    const emailValue = email?.value.trim() || "";
    if (!emailValue) {
      isValid = false;
      showError(email, 'Заполните поле "Email"');
    } else if (
      typeof Validator !== "undefined" &&
      !Validator.email(emailValue)
    ) {
      isValid = false;
      showError(email, "Введите корректный email");
    }

    const phoneValue = phone?.value.trim() || "";
    if (!phoneValue) {
      isValid = false;
      showError(phone, 'Заполните поле "Телефон"');
    } else if (
      typeof Validator !== "undefined" &&
      !Validator.phone(phoneValue)
    ) {
      isValid = false;
      showError(phone, "Введите корректный номер телефона");
    }

    if (!subject?.value) {
      isValid = false;
      showError(subject, "Выберите тему обращения");
    }

    if (!message?.value.trim()) {
      isValid = false;
      showError(message, 'Заполните поле "Сообщение"');
    }

    if (!privacy?.checked) {
      isValid = false;
      const privacyGroup = privacy?.closest(".checkbox-group");
      if (privacyGroup && !privacyGroup.querySelector(".error-message")) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.textContent = "Примите условия Политики конфиденциальности";
        privacyGroup.appendChild(errorDiv);
      }
    }

    return isValid;
  }

  // Очистка формы
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

    const privacy = document.getElementById("privacy");
    if (privacy) privacy.checked = false;

    if (typeof FileManager !== "undefined") {
      FileManager.clearFile();
    }

    const fileDisplay = document.getElementById("fileDisplayContainer");
    if (fileDisplay) {
      fileDisplay.style.display = "none";
      fileDisplay.innerHTML = "";
    }
  }

  // Показ попапа
  function showSuccessPopup() {
    const popup = document.getElementById("contactsPopup");
    if (!popup) return;

    popup.classList.add("success-popup_opened");
    document.body.style.overflow = "hidden";

    const closeBtn = popup.querySelector(".success-popup__close");
    if (closeBtn) {
      closeBtn.onclick = () => {
        popup.classList.remove("success-popup_opened");
        document.body.style.overflow = "";
      };
    }

    popup.onclick = (e) => {
      if (e.target === popup) {
        popup.classList.remove("success-popup_opened");
        document.body.style.overflow = "";
      }
    };
  }

  // ОТПРАВКА ФОРМЫ
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // БЛОКИРУЕМ КНОПКУ
    if (submitButton) {
      submitButton.disabled = true;
    }

    const loaderElement = document.getElementById("loader");
    const startTime = Date.now();

    if (loaderElement) {
      loaderElement.classList.add("loader-visible");
    }

    const formData = new FormData();
    formData.append(
      "lastName",
      document.getElementById("lastname")?.value || "",
    );
    formData.append(
      "firstName",
      document.getElementById("firstname")?.value || "",
    );
    formData.append("email", document.getElementById("email")?.value || "");

    let phoneValue = document.getElementById("phone")?.value || "";
    let cleanPhone = phoneValue.replace(/\D/g, "");
    if (cleanPhone.startsWith("7") && cleanPhone.length === 11) {
      cleanPhone = "+" + cleanPhone;
    } else if (cleanPhone.length === 10) {
      cleanPhone = "+7" + cleanPhone;
    }
    formData.append("phone", cleanPhone);
    formData.append("subject", document.getElementById("subject")?.value || "");
    formData.append("message", document.getElementById("message")?.value || "");

    const fileInput = document.getElementById("fileInput");
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      formData.append("file", fileInput.files[0]);
    }

    const subjectValue = document.getElementById("subject")?.value || "";
    const endpoint =
      subjectValue === "feedback"
        ? "http://localhost:3000/api/reviews"
        : "http://localhost:3000/api/applications";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      const elapsed = Date.now() - startTime;
      const minDelay = 600;

      if (elapsed < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
      }

      if (loaderElement) {
        loaderElement.classList.remove("loader-visible");
      }

      if (result.success) {
        clearForm();
        showSuccessPopup();
        // Кнопка останется disabled через чекбокс (privacy.checked = false)
      } else {
        // Разблокируем кнопку при ошибке
        if (submitButton) {
          submitButton.disabled = false;
        }
        alert("Ошибка: " + (result.error || "Не удалось отправить"));
      }
    } catch (error) {
      const elapsed = Date.now() - startTime;
      const minDelay = 600;

      if (elapsed < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
      }

      if (loaderElement) {
        loaderElement.classList.remove("loader-visible");
      }

      // Разблокируем кнопку при ошибке
      if (submitButton) {
        submitButton.disabled = false;
      }
      console.error("Ошибка:", error);
      alert("Ошибка подключения к серверу. Убедитесь, что сервер запущен.");
    }
  });
})();
