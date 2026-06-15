let token = localStorage.getItem("adminToken");
if (token) checkAuth();
else showLogin();

async function checkAuth() {
  try {
    const res = await fetch("/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) throw new Error();
    if (res.ok) {
      showAdmin();
      loadStats();
      loadOrders();
      loadReviews();
      loadApplications();
    } else {
      showLogin();
    }
  } catch {
    showLogin();
  }
}

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const errorDiv = document.getElementById("loginError");

  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (data.success) {
      token = data.token;
      localStorage.setItem("adminToken", token);
      showAdmin();
      loadStats();
      loadOrders();
      loadReviews();
      loadApplications();
      errorDiv.textContent = "";
    } else {
      errorDiv.textContent = "Неверный email или пароль";
    }
  } catch {
    errorDiv.textContent = "Ошибка подключения к серверу";
  }
}

function showLogin() {
  document.getElementById("loginContainer").style.display = "flex";
  document.getElementById("adminPanel").style.display = "none";
}

function showAdmin() {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";
}

function logout() {
  localStorage.removeItem("adminToken");
  token = null;
  showLogin();
}

function switchTab(tab) {
  document
    .querySelectorAll(".tab-content")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));

  if (tab === "orders") {
    document.getElementById("ordersTab").classList.add("active");
    document.querySelector('[data-tab="orders"]').classList.add("active");
    loadOrders();
  } else if (tab === "reviews") {
    document.getElementById("reviewsTab").classList.add("active");
    document.querySelector('[data-tab="reviews"]').classList.add("active");
    loadReviews();
  } else {
    document.getElementById("applicationsTab").classList.add("active");
    document.querySelector('[data-tab="applications"]').classList.add("active");
    loadApplications();
  }
}

async function loadStats() {
  try {
    const res = await fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById("statOrders").textContent = data.data.orders || 0;
      document.getElementById("statReviews").textContent =
        data.data.reviews || 0;
      document.getElementById("statPending").textContent =
        data.data.pendingReviews || 0;
      document.getElementById("statApplications").textContent =
        data.data.applications || 0;
    }
  } catch (e) {
    console.error(e);
  }
}

// ========== ЗАКАЗЫ ==========
async function loadOrders() {
  try {
    const res = await fetch("/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) renderOrders(data.data);
  } catch (e) {
    console.error(e);
  }
}

function renderOrders(orders) {
  if (!orders || orders.length === 0) {
    document.getElementById("ordersTable").innerHTML =
      '<div class="empty-row">📭 Нет заказов</div>';
    return;
  }

  let html = `<table>
            <thead>
                <tr><th>Дата</th><th>Клиент</th><th>Телефон</th><th>Языки</th><th>Тип</th><th>Стр.</th><th>Нотариус</th><th>Срочность</th><th>Сумма</th><th>Файл</th><th>Действия</th></tr>
            </thead>
            <tbody>`;

  orders.forEach((order) => {
    const notaryServices = [];
    if (order.order.notaryCert) notaryServices.push("Заверение");
    if (order.order.notaryCopy) notaryServices.push("Копия");
    const notaryText = notaryServices.length
      ? notaryServices.join(", ")
      : "Нет";

    let urgencyText = "Обычная";
    if (order.order.urgent) urgencyText = "Срочно";
    if (order.order.superUrgent) urgencyText = "Суперсрочно";

    const docTypeMap = {
      personal: "Личный",
      education: "Образование",
      legal: "Юридический",
      medical: "Медицинский",
      other: "Другое",
    };
    const docType =
      docTypeMap[order.order.documentType] || order.order.documentType;

    html += `<tr>
                <td>${new Date(order.createdAt).toLocaleString()}</td>
                <td><strong>${order.user.lastName} ${order.user.firstName}</strong><br><small>${order.user.email}</small></td>
                <td>${order.user.phone}</td>
                <td>${order.order.languageFrom} → ${order.order.languageTo}</td>
                <td>${docType}</td>
                <td style="text-align: center;">${order.order.pagesCount}</td>
                <td>${notaryText}</td>
                <td>${urgencyText}</td>
                <td><strong>${order.order.totalPrice?.toLocaleString() || 0} ₽</strong></td>
                <td>${order.file ? `<a href="/uploads/${order.file.filename}" class="file-link" target="_blank">📎</a>` : "-"}</td>
                <td><div class="action-btns"><button class="btn-icon btn-view" onclick='viewOrder(${JSON.stringify(order).replace(/'/g, "&#39;")})'>👁️</button><button class="btn-icon btn-delete" onclick="deleteItem('orders', '${order._id}')">🗑️</button></div></td>
            </tr>`;
  });

  html += `</tbody>${"<table>"}`;
  document.getElementById("ordersTable").innerHTML = html;
}

function viewOrder(order) {
  const docTypeMap = {
    personal: "Личный",
    education: "Образование",
    legal: "Юридический",
    medical: "Медицинский",
    other: "Другое",
  };
  let urgencyText = "Обычная";
  if (order.order.urgent) urgencyText = "Срочно (+500 ₽)";
  if (order.order.superUrgent) urgencyText = "Суперсрочно (+1000 ₽)";

  let notaryHtml = "";
  if (order.order.notaryCert || order.order.notaryCopy) {
    if (order.order.notaryCert)
      notaryHtml += "<li>Нотариальное заверение (+800 ₽)</li>";
    if (order.order.notaryCopy)
      notaryHtml += `<li>Нотариальная копия (${order.order.pagesCount} стр. × 200 ₽ = ${order.order.pagesCount * 200} ₽)</li>`;
  } else {
    notaryHtml = "<li>Нет</li>";
  }

  const html = `
            <div class="detail-label">👤 КЛИЕНТ</div><p><strong>${order.user.lastName} ${order.user.firstName}</strong></p>
            <div class="detail-label">📧 КОНТАКТЫ</div><p>📧 ${order.user.email}<br>📞 ${order.user.phone}</p>
            <div class="detail-label">💬 СООБЩЕНИЕ</div><p>${order.user.message || "—"}</p>
            <div class="detail-label">🌐 ПЕРЕВОД</div><p>${order.order.languageFrom} → ${order.order.languageTo}</p>
            <div class="detail-label">📄 ТИП ДОКУМЕНТА</div><p>${docTypeMap[order.order.documentType] || order.order.documentType}</p>
            <div class="detail-label">📑 КОЛИЧЕСТВО СТРАНИЦ</div><p>${order.order.pagesCount} стр. × 700 ₽ = ${order.order.pagesCount * 700} ₽</p>
            <div class="detail-label">📜 НОТАРИАЛЬНЫЕ УСЛУГИ</div><ul style="margin-left: 20px;">${notaryHtml}</ul>
            <div class="detail-label">⏱ СРОЧНОСТЬ</div><p>${urgencyText}</p>
            <div class="detail-label">💰 ИТОГОВАЯ СУММА</div><p style="font-size: 24px; color: #667eea; font-weight: bold;">${order.order.totalPrice?.toLocaleString() || 0} ₽</p>
            ${order.file ? `<div class="detail-label">📎 ПРИКРЕПЛЕННЫЙ ФАЙЛ</div><p><a href="/uploads/${order.file.filename}" class="file-link" target="_blank">📄 ${order.file.originalName}</a><br><small>Размер: ${(order.file.size / 1024).toFixed(2)} КБ</small></p>` : ""}
            <div class="detail-label">📅 ДАТА ЗАКАЗА</div><p>${new Date(order.createdAt).toLocaleString()}</p>
        `;
  document.getElementById("modalBody").innerHTML = html;
  document.getElementById("viewModal").style.display = "flex";
}

// ========== ОТЗЫВЫ ==========
async function loadReviews() {
  const status = document.getElementById("reviewFilter").value;
  const url =
    status === "all"
      ? "/api/admin/reviews"
      : `/api/admin/reviews?status=${status}`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) renderReviews(data.data);
  } catch (e) {
    console.error(e);
  }
}

function renderReviews(reviews) {
  if (!reviews || reviews.length === 0) {
    document.getElementById("reviewsTable").innerHTML =
      '<div class="empty-row">📭 Нет отзывов</div>';
    return;
  }
  const statusText = {
    pending: "На модерации",
    approved: "Одобрен",
    rejected: "Отклонен",
  };
  let html = `<table><th>Дата</th><th>Клиент</th><th>Тема</th><th>Сообщение</th><th>Статус</th><th>Файл</th><th>Действия</th></tr>`;
  reviews.forEach((review) => {
    html += `<tr><td>${new Date(review.createdAt).toLocaleDateString()}</td><td><strong>${review.lastName} ${review.firstName}</strong><br><small>${review.email}</small><br>${review.phone}</td><td>${review.subject}</td><td>${review.message.substring(0, 80)}...</td><td><span class="badge badge-${review.status}">${statusText[review.status]}</span></td><td>${review.file ? `<a href="/uploads/${review.file.filename}" class="file-link" target="_blank">📎</a>` : "-"}</td><td><div class="action-btns"><button class="btn-icon btn-view" onclick='viewReview(${JSON.stringify(review).replace(/'/g, "&#39;")})'>👁️</button>${review.status !== "approved" ? `<button class="btn-icon btn-approve" onclick="updateReviewStatus('${review._id}', 'approved')">✅</button>` : ""}${review.status !== "rejected" ? `<button class="btn-icon btn-reject" onclick="updateReviewStatus('${review._id}', 'rejected')">❌</button>` : ""}<button class="btn-icon btn-delete" onclick="deleteItem('reviews', '${review._id}')">🗑️</button></div></td></tr>`;
  });
  document.getElementById("reviewsTable").innerHTML = `<table>${html}</table>`;
}

function viewReview(review) {
  const html = `<div class="detail-label">👤 КЛИЕНТ</div><p><strong>${review.lastName} ${review.firstName}</strong></p><div class="detail-label">📧 КОНТАКТЫ</div><p>📧 ${review.email}<br>📞 ${review.phone}</p><div class="detail-label">📌 ТЕМА</div><p>${review.subject}</p><div class="detail-label">💬 СООБЩЕНИЕ</div><p>${review.message}</p>${review.file ? `<div class="detail-label">📎 ФАЙЛ</div><p><a href="/uploads/${review.file.filename}" class="file-link" target="_blank">📄 ${review.file.originalName}</a></p>` : ""}<div class="detail-label">📅 ДАТА</div><p>${new Date(review.createdAt).toLocaleString()}</p>`;
  document.getElementById("modalBody").innerHTML = html;
  document.getElementById("viewModal").style.display = "flex";
}

async function updateReviewStatus(id, status) {
  await fetch(`/api/admin/reviews/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  loadReviews();
  loadStats();
}

// ========== ЗАЯВКИ ==========
async function loadApplications() {
  const status = document.getElementById("appFilter").value;
  const url =
    status === "all"
      ? "/api/admin/applications"
      : `/api/admin/applications?status=${status}`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) renderApplications(data.data);
  } catch (e) {
    console.error(e);
  }
}

function renderApplications(apps) {
  if (!apps || apps.length === 0) {
    document.getElementById("applicationsTable").innerHTML =
      '<div class="empty-row">📭 Нет заявок</div>';
    return;
  }
  const statusText = {
    new: "Новая",
    in_progress: "В работе",
    completed: "Завершена",
  };
  let html = `<table><th>Дата</th><th>Клиент</th><th>Тема</th><th>Сообщение</th><th>Статус</th><th>Файл</th><th>Действия</th></tr>`;
  apps.forEach((app) => {
    html += `<tr><td>${new Date(app.createdAt).toLocaleDateString()}</td><td><strong>${app.lastName} ${app.firstName}</strong><br><small>${app.email}</small><br>${app.phone}</td><td>${app.subject}</td><td>${app.message.substring(0, 80)}...</td><td><span class="badge badge-${app.status}">${statusText[app.status]}</span></td><td>${app.file ? `<a href="/uploads/${app.file.filename}" class="file-link" target="_blank">📎</a>` : "-"}</td><td><div class="action-btns"><button class="btn-icon btn-view" onclick='viewApplication(${JSON.stringify(app).replace(/'/g, "&#39;")})'>👁️</button>${app.status === "new" ? `<button class="btn-icon btn-process" onclick="updateAppStatus('${app._id}', 'in_progress')">🔄 В работу</button>` : ""}${app.status === "in_progress" ? `<button class="btn-icon btn-complete" onclick="updateAppStatus('${app._id}', 'completed')">✅ Завершить</button>` : ""}<button class="btn-icon btn-delete" onclick="deleteItem('applications', '${app._id}')">🗑️</button></div></td></tr>`;
  });
  document.getElementById("applicationsTable").innerHTML =
    `<tr>${html}</table>`;
}

function viewApplication(app) {
  const html = `<div class="detail-label">👤 КЛИЕНТ</div><p><strong>${app.lastName} ${app.firstName}</strong></p><div class="detail-label">📧 КОНТАКТЫ</div><p>📧 ${app.email}<br>📞 ${app.phone}</p><div class="detail-label">📌 ТЕМА</div><p>${app.subject}</p><div class="detail-label">💬 СООБЩЕНИЕ</div><p>${app.message}</p>${app.file ? `<div class="detail-label">📎 ФАЙЛ</div><p><a href="/uploads/${app.file.filename}" class="file-link" target="_blank">📄 ${app.file.originalName}</a></p>` : ""}<div class="detail-label">📅 ДАТА</div><p>${new Date(app.createdAt).toLocaleString()}</p>`;
  document.getElementById("modalBody").innerHTML = html;
  document.getElementById("viewModal").style.display = "flex";
}

async function updateAppStatus(id, status) {
  await fetch(`/api/admin/applications/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  loadApplications();
  loadStats();
}

async function deleteItem(type, id) {
  if (!confirm("Удалить запись?")) return;
  await fetch(`/api/admin/${type}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (type === "orders") loadOrders();
  else if (type === "reviews") loadReviews();
  else loadApplications();
  loadStats();
}

function closeModal() {
  document.getElementById("viewModal").style.display = "none";
}
