// // Foydalanuvchi ismini ko‘rsatish
// document.addEventListener("DOMContentLoaded", () => {
//   const username = localStorage.getItem("username") || "Foydalanuvchi";
//   document.getElementById("userWelcome").textContent = `Xush kelibsiz, ${username}`;
//   showSection("overview");
//   renderTickets();
// });

// Sahifani almashtirish
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = link.getAttribute("data-section");
      showSection(section);
  });
});

function showSection(sectionId) {
  document.querySelectorAll(".dashboard-section").forEach(section => {
      section.classList.remove("active");
  });
  document.getElementById(`${sectionId}-section`).classList.add("active");

  document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("data-section") === sectionId) {
          link.classList.add("active");
      }
  });
}

// Logout funksiyasi
function logout() {
  localStorage.removeItem("username");
  window.location.href = "index.html";
}

// So‘rovlar ma’lumotlari (test maqsadida)
let tickets = [
  {
      id: "1",
      title: "Printer ishlamayapti",
      status: "Kutilmoqda",
      priority: "O'rta",
      created: "2025-05-24",
      updated: "2025-05-24",
      description: "Printer haydovchilari yuklanmagan bo'lishi mumkin.",
      category: "hardware"
  },
  {
      id: "2",
      title: "Wi-Fi uzilyapti",
      status: "Bajarildi",
      priority: "Yuqori",
      created: "2025-05-20",
      updated: "2025-05-22",
      description: "Router sozlamalari o‘zgartirildi.",
      category: "network"
  }
];

// Statistikani yangilash va jadvallarni chiqarish
function renderTickets() {
  // Statistikalar
  document.getElementById("totalTickets").textContent = tickets.length;
  document.getElementById("pendingTickets").textContent = tickets.filter(t => t.status === "Kutilmoqda").length;
  document.getElementById("completedTickets").textContent = tickets.filter(t => t.status === "Bajarildi").length;

  // So'nggi 5 ta so‘rov (Overview bo‘limida)
  const recentTable = document.querySelector("#recentTicketsTable tbody");
  recentTable.innerHTML = "";
  tickets.slice(0, 5).forEach(ticket => {
      recentTable.innerHTML += ticketRow(ticket);
  });

  // Barcha so‘rovlar (Tickets bo‘limida)
  const allTable = document.querySelector("#allTicketsTable tbody");
  allTable.innerHTML = "";
  tickets.forEach(ticket => {
      allTable.innerHTML += ticketRow(ticket, true);
  });
}

function ticketRow(ticket, includeMoreColumns = false) {
  return `
      <tr>
          <td>${ticket.id}</td>
          <td>${ticket.title}</td>
          <td>${ticket.status}</td>
          ${includeMoreColumns ? `<td>${ticket.priority}</td>` : ""}
          <td>${ticket.created}</td>
          ${includeMoreColumns ? `<td>${ticket.updated}</td>` : ""}
          <td><button onclick="openTicketModal('${ticket.id}')">Ko‘rish</button></td>
      </tr>
  `;
}

// Modal oynani ochish
function openTicketModal(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  const modal = document.getElementById("ticketModal");
  const details = document.getElementById("ticketDetails");
  details.innerHTML = `
      <p><strong>Sarlavha:</strong> ${ticket.title}</p>
      <p><strong>Kategoriya:</strong> ${ticket.category}</p>
      <p><strong>Muhimlik:</strong> ${ticket.priority}</p>
      <p><strong>Holat:</strong> ${ticket.status}</p>
      <p><strong>Yaratilgan:</strong> ${ticket.created}</p>
      <p><strong>Yangilangan:</strong> ${ticket.updated}</p>
      <p><strong>Tavsif:</strong> ${ticket.description}</p>
  `;
  modal.style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Yangi so‘rov yuborish
document.getElementById("newTicketForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const title = document.getElementById("ticketTitle").value;
  const category = document.getElementById("ticketCategory").value;
  const priority = document.getElementById("ticketPriority").value;
  const description = document.getElementById("ticketDescription").value;

  const newTicket = {
      id: (tickets.length + 1).toString(),
      title,
      category,
      priority,
      status: "Kutilmoqda",
      created: new Date().toISOString().split("T")[0],
      updated: new Date().toISOString().split("T")[0],
      description
  };

  tickets.unshift(newTicket);
  renderTickets();
  this.reset();
  alert("Yangi so‘rov yuborildi!");
  showSection("tickets");
});
