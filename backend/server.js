const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============ НАСТРОЙКА ПОЧТЫ ============
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.bk.ru",
  port: parseInt(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Проверка подключения к почте
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Ошибка подключения к почте:", error);
  } else {
    console.log("✅ Почтовый сервер готов к отправке");
  }
});

// Функция отправки письма
async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"Бюро переводов" <${process.env.EMAIL_USER}>`,
      to: to || process.env.EMAIL_TO,
      subject: subject,
      html: html,
    });
    console.log("✅ Письмо отправлено:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Ошибка отправки письма:", error);
    return false;
  }
}

// Шаблон письма для заявки/отзыва
function getEmailTemplate(data, type) {
  const typeText = type === "review" ? "ОТЗЫВ" : "ЗАЯВКА";
  const date = new Date().toLocaleString("ru-RU");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
        h2 { color: #667eea; }
        .info { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
        .label { font-weight: bold; color: #333; }
        .file { color: #667eea; }
        hr { border: none; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>📋 Новая ${typeText}</h2>
        <p><strong>📅 Дата:</strong> ${date}</p>
        <hr>
        <div class="info">
          <p><span class="label">👤 Фамилия:</span> ${data.lastName}</p>
          <p><span class="label">👤 Имя:</span> ${data.firstName}</p>
          <p><span class="label">📧 Email:</span> ${data.email}</p>
          <p><span class="label">📞 Телефон:</span> ${data.phone}</p>
          <p><span class="label">📌 Тема:</span> ${data.subject}</p>
          <p><span class="label">💬 Сообщение:</span></p>
          <p style="background: #f9f9f9; padding: 10px; border-radius: 5px;">${data.message}</p>
          ${data.fileName ? `<p class="file">📎 Прикреплен файл: ${data.fileName}</p>` : ""}
        </div>
        <hr>
        <p style="color: #666; font-size: 12px;">Это письмо сгенерировано автоматически. Пожалуйста, не отвечайте на него.</p>
      </div>
    </body>
    </html>
  `;
}

// ============ MIDDLEWARE ============
app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:5501",
      "http://127.0.0.1:5501",
      "http://localhost:3000",
      "http://212.67.11.98",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.static(__dirname));

// Папка uploads
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}
app.use("/uploads", express.static("uploads"));

// Multer для файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ============ ПОДКЛЮЧЕНИЕ К MongoDB ============
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/translations_db",
  )
  .then(() => console.log("✅ MongoDB подключена"))
  .catch((err) => console.error("❌ MongoDB ошибка:", err));

// ============ МОДЕЛИ ============

// 1. МОДЕЛЬ ЗАКАЗА (из калькулятора)
const OrderSchema = new mongoose.Schema({
  user: {
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, default: "" },
  },
  order: {
    languageFrom: { type: String, required: true },
    languageTo: { type: String, required: true },
    documentType: { type: String, required: true },
    pagesCount: { type: Number, required: true },
    notaryCert: { type: Boolean, default: false },
    notaryCopy: { type: Boolean, default: false },
    urgent: { type: Boolean, default: false },
    superUrgent: { type: Boolean, default: false },
    tariff: { type: String, default: "nonUrgent" },
    totalPrice: { type: Number, required: true },
  },
  file: {
    filename: String,
    originalName: String,
    size: Number,
    path: String,
  },
  status: { type: String, default: "new" },
  createdAt: { type: Date, default: Date.now },
});

// 2. МОДЕЛЬ ОТЗЫВА
const ReviewSchema = new mongoose.Schema({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  file: {
    filename: String,
    originalName: String,
    size: Number,
    path: String,
  },
  status: { type: String, default: "pending" },
  adminResponse: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

// 3. МОДЕЛЬ ЗАЯВКИ
const ApplicationSchema = new mongoose.Schema({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  file: {
    filename: String,
    originalName: String,
    size: Number,
    path: String,
  },
  status: { type: String, default: "new" },
  adminComment: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

// 4. МОДЕЛЬ АДМИНА
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Хеширование пароля
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Order = mongoose.model("Order", OrderSchema);
const Review = mongoose.model("Review", ReviewSchema);
const Application = mongoose.model("Application", ApplicationSchema);
const Admin = mongoose.model("Admin", AdminSchema);

// ============ МИДЛВЭР АДМИНА ============
const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Нет доступа" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "my_secret_key_2024",
    );
    req.adminId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Неверный токен" });
  }
};

// ============ ПУБЛИЧНЫЕ API ============

// 1. ОТПРАВКА ЗАКАЗА ИЗ КАЛЬКУЛЯТОРА
app.post("/api/orders", upload.single("file"), async (req, res) => {
  console.log("📦 POST /api/orders - заказ из калькулятора");

  try {
    const orderData = JSON.parse(req.body.orderData);

    const order = new Order({
      user: orderData.user,
      order: orderData.order,
    });

    if (req.file) {
      order.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: req.file.path,
      };
    }

    await order.save();
    console.log("✅ Заказ сохранен в коллекцию orders");
    res.json({ success: true, message: "Заказ отправлен" });
  } catch (error) {
    console.error("Ошибка:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// 2. ОТПРАВКА ОТЗЫВА
app.post("/api/reviews", upload.single("file"), async (req, res) => {
  console.log("✍️ POST /api/reviews - отзыв");

  try {
    const { lastName, firstName, email, phone, subject, message } = req.body;

    const review = new Review({
      lastName,
      firstName,
      email,
      phone,
      subject,
      message,
      status: "pending",
    });

    if (req.file) {
      review.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: req.file.path,
      };
    }

    await review.save();
    console.log("✅ Отзыв сохранен в коллекцию reviews");

    // Отправка email
    const emailData = {
      lastName,
      firstName,
      email,
      phone,
      subject,
      message,
      fileName: req.file?.originalName,
    };
    await sendEmail(
      process.env.EMAIL_TO,
      `📝 Новый отзыв от ${firstName} ${lastName}`,
      getEmailTemplate(emailData, "review"),
    );

    res.json({ success: true, message: "Отзыв отправлен" });
  } catch (error) {
    console.error("Ошибка:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// 3. ОТПРАВКА ЗАЯВКИ
app.post("/api/applications", upload.single("file"), async (req, res) => {
  console.log("📋 POST /api/applications - заявка");

  try {
    const { lastName, firstName, email, phone, subject, message } = req.body;

    const application = new Application({
      lastName,
      firstName,
      email,
      phone,
      subject,
      message,
      status: "new",
    });

    if (req.file) {
      application.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: req.file.path,
      };
    }

    await application.save();
    console.log("✅ Заявка сохранена в коллекцию applications");

    // Отправка email
    const emailData = {
      lastName,
      firstName,
      email,
      phone,
      subject,
      message,
      fileName: req.file?.originalName,
    };
    await sendEmail(
      process.env.EMAIL_TO,
      `📋 Новая заявка от ${firstName} ${lastName}`,
      getEmailTemplate(emailData, "application"),
    );

    res.json({ success: true, message: "Заявка отправлена" });
  } catch (error) {
    console.error("Ошибка:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// 4. ПОЛУЧЕНИЕ ОДОБРЕННЫХ ОТЗЫВОВ (для страницы reviews.html)
app.get("/api/reviews/approved", async (req, res) => {
  try {
    const reviews = await Review.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ АДМИН API ============

// Вход
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || "my_secret_key_2024",
      { expiresIn: "24h" },
    );
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получить заказы (из калькулятора)
app.get("/api/admin/orders", auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получить отзывы
app.get("/api/admin/reviews", auth, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "all" ? { status } : {};
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получить заявки
app.get("/api/admin/applications", auth, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "all" ? { status } : {};
    const applications = await Application.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить статус отзыва
app.patch("/api/admin/reviews/:id/status", auth, async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status, adminResponse: adminResponse || "" },
      { new: true },
    );
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить статус заявки
app.patch("/api/admin/applications/:id/status", auth, async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, adminComment: adminComment || "" },
      { new: true },
    );
    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить статус заказа
app.patch("/api/admin/orders/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Удаление
app.delete("/api/admin/:type/:id", auth, async (req, res) => {
  const { type, id } = req.params;
  try {
    if (type === "orders") await Order.findByIdAndDelete(id);
    else if (type === "reviews") await Review.findByIdAndDelete(id);
    else if (type === "applications") await Application.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Статистика
app.get("/api/admin/stats", auth, async (req, res) => {
  try {
    const orders = await Order.countDocuments();
    const reviews = await Review.countDocuments();
    const pendingReviews = await Review.countDocuments({ status: "pending" });
    const applications = await Application.countDocuments();
    const newApplications = await Application.countDocuments({ status: "new" });

    res.json({
      success: true,
      data: { orders, reviews, pendingReviews, applications, newApplications },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ СОЗДАНИЕ АДМИНА ============
async function createAdmin() {
  try {
    const exists = await Admin.findOne({ email: "admin@example.com" });
    if (!exists) {
      const admin = new Admin({
        email: "admin@example.com",
        password: "admin123",
      });
      await admin.save();
      console.log("✅ Админ создан: admin@example.com / admin123");
    }
  } catch (error) {
    console.error("Ошибка создания админа:", error);
  }
}

// ============ ЗАПУСК ============
app.listen(PORT, async () => {
  await createAdmin();
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                 🚀 СЕРВЕР ЗАПУЩЕН!                          ║
║                 📍 http://localhost:${PORT}                  ║
║                                                              ║
║  📦 КОЛЛЕКЦИИ:                                              ║
║     orders       - заказы из калькулятора                   ║
║     reviews      - отзывы (после одобрения на сайте)        ║
║     applications - заявки (только в админке)                ║
║                                                              ║
║  📧 ПОЧТА НАСТРОЕНА                                         ║
║     Уведомления будут приходить на ${process.env.EMAIL_TO}   ║
║                                                              ║
║  🔐 Админка: http://localhost:${PORT}/admin.html             ║
║     👤 admin@example.com                                    ║
║     🔑 admin123                                             ║
╚══════════════════════════════════════════════════════════════╝
  `);
});
