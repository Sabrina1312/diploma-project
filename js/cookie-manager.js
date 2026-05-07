(function () {
  const COOKIE_KEY = "cookiesAccepted";

  // Если уже согласился — вообще ничего не делаем, баннер не создаём
  if (localStorage.getItem(COOKIE_KEY) === "true") {
    return;
  }

  // Создаём баннер
  const bannerHTML = `
    <div class="cookie-notice" id="cookieNotice">
      <p>
        Мы используем файлы cookie. Продолжая пользоваться сайтом вы даете
        согласие на использование cookies, а также ознакомлены и даете
        <a class="link link-hover" href="privacy-policy.html">согласие на обработку персональных данных</a>.
      </p>
      <button type="button" class="button cookie-agree" id="cookieAgreeBtn">СОГЛАСИТЬСЯ</button>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", bannerHTML);

  const notice = document.getElementById("cookieNotice");
  const agreeBtn = document.getElementById("cookieAgreeBtn");
  const resetBtn = document.getElementById("resetCookiesBtn");

  function acceptCookies() {
    localStorage.setItem(COOKIE_KEY, "true");
    if (notice) notice.classList.add("hidden");
  }

  function resetCookies() {
    localStorage.removeItem(COOKIE_KEY);
    location.reload();
  }

  if (agreeBtn) agreeBtn.addEventListener("click", acceptCookies);
  if (resetBtn) resetBtn.addEventListener("click", resetCookies);
})();
