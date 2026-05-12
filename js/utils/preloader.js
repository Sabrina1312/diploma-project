// ============================================================
// ПРЕЛОАДЕР
// ============================================================

(function () {
  let preloaderElement = null;

  function createPreloader() {
    if (preloaderElement) return preloaderElement;

    preloaderElement = document.createElement("div");
    preloaderElement.className = "ajax-preloader";
    preloaderElement.innerHTML = `
      <div class="preloader-overlay">
        <div class="preloader-spinner"></div>
        <p>Отправка данных...</p>
      </div>
    `;
    document.body.appendChild(preloaderElement);
    return preloaderElement;
  }

  window.showPreloader = function () {
    const preloader = createPreloader();
    preloader.style.display = "block";
  };

  window.hidePreloader = function () {
    if (preloaderElement) {
      preloaderElement.style.display = "none";
    }
  };
})();
