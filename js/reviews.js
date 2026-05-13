// Массив цветов для фона аватаров (циклически применяются к аватарам)
const avatarColors = ["#0000FE", "#171717", "#0000CA", "#797979"];

/**
 * Функция получения инициалов из полного имени
 * @param {string} fullName - Полное имя пользователя
 * @returns {string} Инициалы в верхнем регистре (2 буквы или первые 2 буквы)
 */
function getInitials(fullName) {
  // Разбиваем строку на части, удаляя лишние пробелы по краям
  const parts = fullName.trim().split(" ");

  // Если имя состоит из одного слова (например, только имя или никнейм)
  if (parts.length === 1) {
    // Берем первые 2 символа и переводим в верхний регистр
    return parts[0].substring(0, 2).toUpperCase();
  }

  // Если имя состоит из двух и более слов
  // Берем первый символ первого слова (имя) и первый символ второго слова (фамилия)
  const firstName = parts[0] || ""; // Первое слово (имя)
  const lastName = parts[1] || ""; // Второе слово (фамилия)

  // Объединяем первые буквы и переводим в верхний регистр
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}

// Ждем полной загрузки DOM перед выполнением кода
document.addEventListener("DOMContentLoaded", () => {
  // Находим все элементы с классом "reviews-avatar" (аватары в отзывах)
  const avatars = document.querySelectorAll(".reviews-avatar");

  // Перебираем все найденные аватары
  avatars.forEach((avatar, index) => {
    // Получаем значение атрибута data-name (имя пользователя)
    const name = avatar.getAttribute("data-name");

    // Если имя существует (не null, не undefined, не пустая строка)
    if (name) {
      // Получаем инициалы из имени
      const initials = getInitials(name);
      // Вставляем инициалы внутрь элемента аватара
      avatar.textContent = initials;

      // Вычисляем индекс цвета для текущего аватара (циклически)
      // Берем остаток от деления номера аватара на количество цветов
      const colorIndex = index % avatarColors.length;
      // Применяем цвет фона
      avatar.style.backgroundColor = avatarColors[colorIndex];
    }
  });
});
