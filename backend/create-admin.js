const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Подключение к MongoDB
mongoose
  .connect("mongodb://localhost:27017/translations_db")
  .then(() => console.log("✅ Подключено к MongoDB"))
  .catch((err) => {
    console.error("❌ Ошибка подключения:", err);
    process.exit(1);
  });

// Схема администратора
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.model("Admin", AdminSchema);

async function createAdmin() {
  try {
    // Удаляем всех существующих админов
    const deleted = await Admin.deleteMany({});
    console.log(`🗑️ Удалено старых админов: ${deleted.deletedCount}`);

    // Хешируем пароль "admin123"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Создаем нового админа
    const admin = new Admin({
      email: "admin@example.com",
      password: hashedPassword,
      lastLogin: null,
    });

    await admin.save();

    console.log("\n✅ АДМИН УСПЕШНО СОЗДАН!\n");
    console.log("📧 Email: admin@example.com");
    console.log("🔑 Пароль: admin123");
    console.log("🔐 Хеш пароля:", hashedPassword);

    // Проверяем что пароль работает
    const testAdmin = await Admin.findOne({ email: "admin@example.com" });
    const isValid = await bcrypt.compare("admin123", testAdmin.password);
    console.log(
      "\n✅ Проверка пароля:",
      isValid ? "ПРОШЛА УСПЕШНО ✓" : "НЕ ПРОШЛА ✗",
    );
  } catch (error) {
    console.error("❌ Ошибка при создании админа:", error);
  } finally {
    // Закрываем подключение к MongoDB
    await mongoose.disconnect();
    console.log("\n👋 Отключено от MongoDB");
  }
}

// Запускаем создание админа
createAdmin();
