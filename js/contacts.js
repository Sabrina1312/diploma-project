document.getElementById("attachSvg").onclick = () =>
  document.getElementById("fileInput").click();

document.getElementById("privacy").addEventListener("change", (e) => {
  document.querySelector(".submit-btn").disabled = !e.target.checked;
});

// Делаем кнопку неактивной
document.querySelector(".submit-btn").disabled = true;

document.getElementById("attachSvg").onclick = () =>
  document.getElementById("fileInput").click();

// --- Функция показа попапа ---
function showSuccessPopup() {
  const popup = document.querySelector(".success-popup__overlay");
  popup.classList.add("success-popup_opened");

  // Закрытие по кнопке
  popup.querySelector(".success-popup__close").onclick = () =>
    popup.classList.remove("success-popup_opened");
}

// --- Валидация формы ---
function validateForm(form) {
  let isValid = true;
  const fields = {
    lastname: "Фамилия",
    firstname: "Имя",
    email: "Email",
    phone: "Номер телефона",
    subject: "Тема",
    message: "Сообщение",
  };

  // Убираем старые ошибки
  form.querySelectorAll(".error-message").forEach((el) => el.remove());
  form
    .querySelectorAll(".error-border")
    .forEach((el) => el.classList.remove("error-border"));

  // Проверка каждого поля
  for (const [id, label] of Object.entries(fields)) {
    const field = document.getElementById(id);
    if (!field) continue;

    let value = field.value.trim();

    // Пропускаем, если поле необязательное
    if (id === "subject" && value === "") {
      value = ""; // пустое значение для select
    }

    if (value === "") {
      isValid = false;
      showError(field, `Пожалуйста, заполните поле "${label}"`);
    } else if (id === "email" && !validateEmail(value)) {
      isValid = false;
      showError(field, "Введите корректный email (например, name@domain.com)");
    } else if (id === "phone" && !validatePhone(value)) {
      isValid = false;
      showError(
        field,
        "Введите корректный номер телефона (например, +7 123 456-78-90)",
      );
    }
  }

  return isValid;
}

function showError(field, message) {
  field.classList.add("error-border");
  const error = document.createElement("div");
  error.className = "error-message";
  error.style.color = "#e74c3c";
  error.style.fontSize = "12px";
  error.style.marginTop = "4px";
  error.innerText = message;
  field.parentNode.appendChild(error);
}

function validateEmail(email) {
  const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[\d\s\+\-\(\)]{10,20}$/;
  return re.test(phone);
}

// --- Обработка чекбокса и кнопки ---
const privacyCheckbox = document.getElementById("privacy");
const submitBtn = document.querySelector(".submit-btn");

function updateButtonState() {
  submitBtn.disabled = !privacyCheckbox.checked;
}

privacyCheckbox.addEventListener("change", updateButtonState);
updateButtonState(); // начальное состояние

// --- Обработка отправки формы ---
const form = document.querySelector(".contacts__form form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Валидация перед отправкой
  if (!validateForm(form)) {
    return;
  }

  // Проверка чекбокса (на всякий случай)
  if (!privacyCheckbox.checked) {
    alert("Пожалуйста, примите условия Политики конфиденциальности");
    return;
  }

  // Блокируем кнопку на время отправки, чтобы не было двойного клика
  submitBtn.disabled = true;
  submitBtn.textContent = "ОТПРАВКА...";

  try {
    // --- ИМИТАЦИЯ ОТПРАВКИ НА СЕРВЕР ---
    // Отправка на сервер. Когда бэкенд будет готов.
    /*
    const formData = new FormData(form);
    const response = await fetch('/обработчик', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Ошибка сети');
    }
    */

    // Имитация задержки сервера
    await new Promise((resolve) => setTimeout(resolve, 800));

    // --- УСПЕШНАЯ ОТПРАВКА ---
    showSuccessPopup();
    form.reset();
    updateButtonState();
  } catch (error) {
    console.error("Ошибка:", error);
    alert("Произошла ошибка при отправке. Попробуйте позже.");
  } finally {
    submitBtn.disabled = !privacyCheckbox.checked;
    submitBtn.textContent = "ОТПРАВИТЬ";
  }
});

// Функция для форматирования номера телефона
function formatPhoneNumber(input) {
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
}

const phoneInputs = document.querySelectorAll('input[type="tel"]');

phoneInputs.forEach((input) => {
  input.addEventListener("input", function () {
    formatPhoneNumber(this);
  });

  input.addEventListener("focusout", function () {
    formatPhoneNumber(this);
  });
});
