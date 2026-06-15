// ============================================================
// ПЕРЕКЛЮЧЕНИЕ ТАБОВ НА СТРАНИЦЕ УСЛУГ (services.html)
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".category-tab");
  const contents = document.querySelectorAll(".prices-content");

  // Тексты для разных разрешений
  const fullTexts = {
    popular: "ПОПУЛЯРНЫЕ",
    european: "ЕВРОПЕЙСКИЕ",
    rare: "РЕДКИЕ",
  };

  const shortTexts = {
    popular: "ПОП",
    european: "ЕВР",
    rare: "РЕД",
  };

  // Проверка ширины экрана
  function isMobile() {
    return window.innerWidth <= 620;
  }

  // Обновление текста кнопок
  function updateButtonTexts() {
    const isMobileView = isMobile();

    tabs.forEach((tab) => {
      const category = tab.getAttribute("data-category");
      const isActive = tab.classList.contains("active");

      if (isMobileView && !isActive) {
        // Неактивные кнопки на мобильных - короткий текст
        tab.textContent = shortTexts[category];
        tab.style.width = "100px";
      } else if (isMobileView && isActive) {
        // Активная кнопка на мобильных - полный текст
        tab.textContent = fullTexts[category];
        tab.style.width = "200px";
      } else {
        // Десктоп - полный текст
        tab.textContent = fullTexts[category];
        tab.style.width = "";
      }
    });
  }

  // Функция обновления классов цветов у табов
  function updateTabColors(activeCategory) {
    const tabs = document.querySelectorAll(".category-tab");
    const categories = ["popular", "european", "rare"];
    const activeIndex = categories.indexOf(activeCategory);

    tabs.forEach((tab, index) => {
      const category = tab.getAttribute("data-category");

      // Сбрасываем все классы
      tab.classList.remove("active", "light-grey-color", "gray-color");

      if (category === activeCategory) {
        // Активный таб - белый
        tab.classList.add("active");
      } else if (activeCategory === "popular") {
        // popular активен
        if (category === "european") {
          tab.classList.add("light-grey-color");
        } else if (category === "rare") {
          tab.classList.add("gray-color");
        }
      } else if (activeCategory === "european") {
        // european активен
        if (category === "rare") {
          tab.classList.add("light-grey-color");
        } else if (category === "popular") {
          tab.classList.add("gray-color");
        }
      } else if (activeCategory === "rare") {
        // rare активен
        if (category === "popular") {
          tab.classList.add("light-grey-color");
        } else if (category === "european") {
          tab.classList.add("gray-color");
        }
      }
    });
  }

  function switchTab(category) {
    // Скрываем все контенты
    contents.forEach((content) => {
      content.classList.remove("active");
    });

    // Показываем выбранный контент
    const activeContent = document.getElementById(`${category}-content`);
    if (activeContent) {
      activeContent.classList.add("active");
    }

    // Обновляем цвета табов
    updateTabColors(category);

    // Обновляем тексты кнопок (для мобильной версии)
    updateButtonTexts();
  }

  // Добавляем обработчики на табы
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const category = tab.getAttribute("data-category");
      switchTab(category);
    });
  });

  // Следим за изменением размера окна
  window.addEventListener("resize", function () {
    // Определяем активную категорию
    let activeCategory = "popular";
    tabs.forEach((tab) => {
      if (tab.classList.contains("active")) {
        activeCategory = tab.getAttribute("data-category");
      }
    });
    updateTabColors(activeCategory);
    updateButtonTexts();
  });

  // Инициализация: делаем первый таб активным
  switchTab("popular");
});
