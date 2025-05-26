document.addEventListener("DOMContentLoaded", () => {
  updateWelcomeText();
  setupNavigation();
  handleNewTicketForm();
  loadTicketStats();
  loadRecentTickets();
  loadAllTickets();
});

function updateWelcomeText() {
  const user = localStorage.getItem("username") || "Foydalanuvchi";
  document.getElementById("userWelcome").textContent = `Xush kelibsiz, ${user}`;
}

function showSection(section) {
  const sections = document.querySelectorAll('.dashboard-section');
  sections.forEach(sec => sec.classList.add('hidden'));

  const navLinks = document.querySelectorAll('.dashboard-nav a');
  navLinks.forEach(link => link.classList.remove('active'));

  document.getElementById(`${section}-section`).classList.remove('hidden');
  event.target.classList.add('active');
}

function handleNewTicketForm() {
  const form = document.getElementById('newTicketForm');
  form.addEventListener('submit', (e) => {
      e.preventDefault();

      const ticket = {
          id: Date.now(),
          title: document.getElementById('ticketTitle').value,
          category: document.getElementById('ticketCategory').value,
          priority: document.getElementById('ticketPriority').value,
          description: document.getElementById('ticketDescription').value,
          status: 'Kutilmoqda',
          createdAt: new Date().toLocaleString(),
          updatedAt: new Date().toLocaleString()
      };

      // Saqlash
      const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
      tickets.push(ticket);
      localStorage.setItem('tickets', JSON.stringify(tickets));

      alert("So'rov muvaffaqiyatli yuborildi!");
      form.reset();

      loadTicketStats();
      loadRecentTickets();
      loadAllTickets();
      showSection('tickets');
  });
}

function loadTicketStats() {
  const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
  const total = tickets.length;
  const pending = tickets.filter(t => t.status === 'Kutilmoqda').length;
  const completed = tickets.filter(t => t.status === 'Bajarilgan').length;

  document.getElementById('totalTickets').textContent = total;
  document.getElementById('pendingTickets').textContent = pending;
  document.getElementById('completedTickets').textContent = completed;
}

function loadRecentTickets() {
  const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
  const tbody = document.querySelector('#recentTicketsTable tbody');
  tbody.innerHTML = '';

  tickets.slice(-5).reverse().forEach(ticket => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${ticket.id}</td>
          <td>${ticket.title}</td>
          <td>${ticket.status}</td>
          <td>${ticket.createdAt}</td>
          <td><button onclick="viewTicket(${ticket.id})">Ko'rish</button></td>
      `;
      tbody.appendChild(tr);
  });
}

function loadAllTickets() {
  const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
  const tbody = document.querySelector('#allTicketsTable tbody');
  tbody.innerHTML = '';

  tickets.reverse().forEach(ticket => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${ticket.id}</td>
          <td>${ticket.title}</td>
          <td>${ticket.status}</td>
          <td>${ticket.priority}</td>
          <td>${ticket.createdAt}</td>
          <td>${ticket.updatedAt}</td>
          <td><button onclick="viewTicket(${ticket.id})">Ko'rish</button></td>
      `;
      tbody.appendChild(tr);
  });
}

function viewTicket(ticketId) {
  const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
  const ticket = tickets.find(t => t.id === ticketId);

  if (ticket) {
      const details = `
          <p><strong>Sarlavha:</strong> ${ticket.title}</p>
          <p><strong>Kategoriya:</strong> ${ticket.category}</p>
          <p><strong>Muhimlik:</strong> ${ticket.priority}</p>
          <p><strong>Holat:</strong> ${ticket.status}</p>
          <p><strong>Tavsif:</strong> ${ticket.description}</p>
          <p><strong>Yaratilgan:</strong> ${ticket.createdAt}</p>
          <p><strong>Yangilangan:</strong> ${ticket.updatedAt}</p>
      `;
      document.getElementById('ticketDetails').innerHTML = details;
      openModal('ticketModal');
  }
}

function openModal(id) {
  document.getElementById(id).style.display = "block";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

function logout() {
  localStorage.removeItem('username');
  window.location.href = 'index.html';
}
// Sahifa yuklanganda Overview bo'limini ko'rsatish
document.addEventListener("DOMContentLoaded", function () {
  showSection("overview");

  // Foydalanuvchi nomini chiqarish (misol uchun)
  const username = localStorage.getItem("username") || "Foydalanuvchi";
  document.getElementById("userWelcome").innerText = `Xush kelibsiz, ${username}`;

  // Formani yuborishda so‘rovni saqlash
  document.getElementById("newTicketForm").addEventListener("submit", handleTicketSubmit);
});

// Bo'limlarni almashtirish
function showSection(section) {
  document.querySelectorAll(".dashboard-section").forEach((el) => el.classList.add("hidden"));
  document.getElementById(`${section}-section`).classList.remove("hidden");

  // Aktiv linkni o'zgartirish
  document.querySelectorAll(".dashboard-nav a").forEach((link) => link.classList.remove("active"));
  const activeLink = [...document.querySelectorAll(".dashboard-nav a")].find((a) =>
      a.getAttribute("onclick")?.includes(section)
  );
  if (activeLink) activeLink.classList.add("active");

  if (section === "overview") {
      renderOverviewStats();
      renderRecentTickets();
  } else if (section === "tickets") {
      renderAllTickets();
  }
}

// Logout
function logout() {
  localStorage.removeItem("username");
  window.location.href = "login.html"; // yoki boshqa login sahifangiz
}

// Yangi so'rovni yuborish
async function handleTicketSubmit(event) {
  event.preventDefault();

  const title = document.getElementById("ticketTitle").value.trim();
  const category = document.getElementById("ticketCategory").value;
  const priority = document.getElementById("ticketPriority").value;
  const description = document.getElementById("ticketDescription").value.trim();
  const files = document.getElementById("ticketAttachments").files;

  if (!title || !category || !priority || !description) {
      alert("Iltimos, barcha maydonlarni to'ldiring.");
      return;
  }

  const attachments = await handleFileUpload(files);

  const newTicket = {
      id: generateId(),
      title,
      category,
      priority,
      description,
      status: "Kutilmoqda",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments,
  };

  const tickets = JSON.parse(localStorage.getItem("dern_tickets") || "[]");
  tickets.push(newTicket);
  localStorage.setItem("dern_tickets", JSON.stringify(tickets));

  alert("So‘rovingiz yuborildi.");
  document.getElementById("newTicketForm").reset();
  showSection("tickets");
}

// Statistika ko'rsatish
function renderOverviewStats() {
  const tickets = JSON.parse(localStorage.getItem("dern_tickets") || "[]");
  document.getElementById("totalTickets").innerText = tickets.length;
  document.getElementById("pendingTickets").innerText = tickets.filter(t => t.status === "Kutilmoqda").length;
  document.getElementById("completedTickets").innerText = tickets.filter(t => t.status === "Bajarilgan").length;
}

// So'nggi 5 ta so'rovni ko'rsatish
function renderRecentTickets() {
  const tickets = JSON.parse(localStorage.getItem("dern_tickets") || "[]");
  const recent = tickets.slice(-5).reverse();

  const tbody = document.querySelector("#recentTicketsTable tbody");
  tbody.innerHTML = "";

  recent.forEach(ticket => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${ticket.id}</td>
          <td>${ticket.title}</td>
          <td>${ticket.status}</td>
          <td>${new Date(ticket.createdAt).toLocaleString()}</td>
          <td><button onclick="openTicketModal('${ticket.id}')">Ko'rish</button></td>
      `;
      tbody.appendChild(row);
  });
}

// Barcha so'rovlarni ko'rsatish
function renderAllTickets() {
  const tickets = JSON.parse(localStorage.getItem("dern_tickets") || "[]");

  const tbody = document.querySelector("#allTicketsTable tbody");
  tbody.innerHTML = "";

  tickets.reverse().forEach(ticket => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${ticket.id}</td>
          <td>${ticket.title}</td>
          <td>${ticket.status}</td>
          <td>${ticket.priority}</td>
          <td>${new Date(ticket.createdAt).toLocaleString()}</td>
          <td>${new Date(ticket.updatedAt).toLocaleString()}</td>
          <td><button onclick="openTicketModal('${ticket.id}')">Ko'rish</button></td>
      `;
      tbody.appendChild(row);
  });
}

// Modalni ochish
function openTicketModal(ticketId) {
  const tickets = JSON.parse(localStorage.getItem("dern_tickets") || "[]");
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;

  const container = document.getElementById("ticketDetails");
  container.innerHTML = `
      <p><strong>Sarlavha:</strong> ${ticket.title}</p>
      <p><strong>Kategoriya:</strong> ${ticket.category}</p>
      <p><strong>Muhimlik:</strong> ${ticket.priority}</p>
      <p><strong>Holat:</strong> ${ticket.status}</p>
      <p><strong>Tavsif:</strong> ${ticket.description}</p>
      <p><strong>Yaratilgan:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
      <p><strong>Fayllar:</strong></p>
      ${ticket.attachments.map(att => displayFile(att.id)).join("<br>")}
  `;

  document.getElementById("ticketModal").style.display = "block";
}

// Modalni yopish
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}
