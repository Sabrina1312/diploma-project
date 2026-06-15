// ============================================================
// ОТОБРАЖЕНИЕ ОДОБРЕННЫХ ОТЗЫВОВ (для страницы reviews.html)
// ============================================================

async function loadApprovedReviews() {
  console.log("🔄 Загрузка отзывов...");

  const swiperWrapper = document.querySelector(
    ".reviews__swiper .swiper-wrapper",
  );
  if (!swiperWrapper) {
    console.log("❌ Swiper wrapper не найден");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/reviews/approved");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reviews = await response.json();
    console.log("✅ Получено отзывов:", reviews.length);
    console.log("Отзывы:", reviews);

    if (reviews.length > 0) {
      swiperWrapper.innerHTML = "";

      const colors = ["#0000FE", "#171717", "#0000CA", "#797979"];

      reviews.forEach((review, index) => {
        const firstName = review.firstName || "Пользователь";
        const lastName = review.lastName || "";
        const initials = (
          firstName.charAt(0) + lastName.charAt(0)
        ).toUpperCase();

        const date = new Date(review.createdAt);
        const formattedDate = date.toLocaleDateString("ru-RU");

        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        slide.innerHTML = `
          <div class="reviews-slide">
            <div class="reviews-title">
              <div class="reviews-avatar" style="background-color: ${colors[index % colors.length]}">
                ${initials || "U"}
              </div>
              <h4 class="reviews-name">${escapeHtml(firstName)} ${escapeHtml(lastName)}</h4>
            </div>
            <p class="reviews-content">${escapeHtml(review.message)}</p>
            <div style="font-size: 12px; color: #999; margin-top: 10px;">
              ${formattedDate}
            </div>
          </div>
        `;
        swiperWrapper.appendChild(slide);
      });

      // Инициализируем или обновляем Swiper
      if (typeof Swiper !== "undefined") {
        if (window.reviewsSwiper) {
          window.reviewsSwiper.update();
        } else {
          window.reviewsSwiper = new Swiper(".reviews__swiper", {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
              delay: 5000,
              disableOnInteraction: false,
            },
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
            breakpoints: {
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            },
          });
        }
      }
    } else {
      console.log("📭 Нет одобренных отзывов");
      swiperWrapper.innerHTML =
        '<div style="text-align: center; padding: 40px;">Пока нет отзывов. Будьте первым!</div>';
    }
  } catch (error) {
    console.error("❌ Ошибка загрузки отзывов:", error);
    const swiperWrapper = document.querySelector(
      ".reviews__swiper .swiper-wrapper",
    );
    if (swiperWrapper) {
      swiperWrapper.innerHTML =
        '<div style="text-align: center; padding: 40px; color: red;">Ошибка загрузки отзывов</div>';
    }
  }
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Загружаем отзывы после полной загрузки страницы
document.addEventListener("DOMContentLoaded", () => {
  console.log("📄 Страница отзывов загружена");
  loadApprovedReviews();
});
