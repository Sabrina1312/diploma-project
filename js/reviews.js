const avatarColors = ["#0000FE", "#171717", "#0000CA", "#797979"];

function getInitials(fullName) {
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  const firstName = parts[0] || "";
  const lastName = parts[1] || "";
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}

document.addEventListener("DOMContentLoaded", () => {
  const avatars = document.querySelectorAll(".reviews-avatar");

  avatars.forEach((avatar, index) => {
    const name = avatar.getAttribute("data-name");

    if (name) {
      const initials = getInitials(name);
      avatar.textContent = initials;

      const colorIndex = index % avatarColors.length;
      avatar.style.backgroundColor = avatarColors[colorIndex];
    }
  });
});
