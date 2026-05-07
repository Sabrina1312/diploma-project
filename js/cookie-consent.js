//Куки
// cookie-consent.js
(function () {
  const COOKIE_KEY = "cookiesAccepted";
  const COOKIE_EXPIRY_DAYS = 365; // на год

  const notice = document.getElementById("cookieNotice");
  const agreeBtn = document.getElementById("cookieAgreeBtn");

  // Проверяем, есть ли уже согласие
  function isCookiesAccepted() {
    return localStorage.getItem(COOKIE_KEY) === "true";
  }

  // Сохраняем согласие
  function acceptCookies() {
    localStorage.setItem(COOKIE_KEY, "true");
    hideNotice();
  }

  // Скрываем баннер
  function hideNotice() {
    if (notice) {
      notice.classList.add("hidden");
    }
  }

  // Показываем баннер
  function showNotice() {
    if (notice) {
      notice.classList.remove("hidden");
    }
  }

  // Инициализация
  function init() {
    if (!notice) return;

    if (isCookiesAccepted()) {
      hideNotice(); // уже согласился — скрываем
    } else {
      showNotice(); // не согласился — показываем
    }

    // Вешаем обработчик на кнопку
    if (agreeBtn) {
      agreeBtn.addEventListener("click", acceptCookies);
    }
  }

  // Запускаем после загрузки DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
