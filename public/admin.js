
let currentAdminSection = "overview"
let currentUser
let tickets
let users
let inventory
const loadData = window.loadData
const saveData = window.saveData
const formatDate = window.formatDate
const generateId = window.generateId
const closeModal = window.closeModal


function getStatusText(status) {
  switch (status) {
    case "pending":      return "Kutilmoqda"
    case "in-progress":  return "Jarayonda"
    case "completed":    return "Tugallangan"
    case "cancelled":    return "Bekor qilingan"
    default:             return "Noma'lum"
  }
}
function getPriorityText(priority) {
  switch (priority) {
    case "low":      return "Past"
    case "medium":   return "O'rtacha"
    case "high":     return "Yuqori"
    case "urgent":   return "Shoshilinch"
    default:         return "Noma'lum"
  }
}

document.addEventListener("DOMContentLoaded", () => {
  
  const savedUser = localStorage.getItem("currentUser")
  if (!savedUser) {
    window.location.href = "index.html"
    return
  }
  currentUser = JSON.parse(savedUser)
  if (!currentUser.isAdmin) {
    alert("Kirish rad etildi. Admin huquqlari talab qilinadi.")
    window.location.href = "index.html"
    return
  }
  document.getElementById("adminWelcome").textContent = `Xush kelibsiz, ${currentUser.name}`
  loadAdminDashboardData()
  setupAdminEventListeners()
  showAdminSection("overview")
})

function setupAdminEventListeners() {
  document.getElementById("editTicketForm").addEventListener("submit", handleEditTicket)
  document.getElementById("addInventoryForm").addEventListener("submit", handleAddInventory)
}



function loadAdminDashboardData() {
  loadData()
  tickets = window.tickets
  users = window.users
  inventory = window.inventory
  updateAdminStats()
  loadAdminTickets()
  loadInventory()
  loadUsers()
  loadRecentActivity()
}



function updateAdminStats() {
  const totalTickets = tickets.length
  const pendingTickets = tickets.filter(
    (ticket) => ticket.status === "pending" || ticket.status === "in-progress"
  ).length
  const completedToday = tickets.filter((ticket) => {
    const today = new Date().toDateString()
    const ticketDate = new Date(ticket.updatedAt).toDateString()
    return ticket.status === "completed" && ticketDate === today
  }).length
  const totalUsers = users.filter((user) => !user.isAdmin).length

  document.getElementById("adminTotalTickets").textContent = totalTickets
  document.getElementById("adminPendingTickets").textContent = pendingTickets
  document.getElementById("adminCompletedTickets").textContent = completedToday
  document.getElementById("adminTotalUsers").textContent = totalUsers
}


function loadAdminTickets() {
  const tbody = document.querySelector("#adminTicketsTable tbody")
  tbody.innerHTML = ""

  tickets
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach((ticket) => {
      const user = users.find((u) => u.id === ticket.userId) || { name: "Noma'lum foydalanuvchi" }
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>#${ticket.id}</td>
        <td>${ticket.customerName || user.name}</td>
        <td>${ticket.title}</td>
        <td><span class="status-badge status-${ticket.status}">${getStatusText(ticket.status)}</span></td>
        <td><span class="priority-${ticket.priority}">${getPriorityText(ticket.priority)}</span></td>
        <td>${ticket.category}</td>
        <td>${formatDate(ticket.createdAt)}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-small btn-view" onclick="viewAdminTicket(${ticket.id})">Ko'rish</button>
            <button class="btn-small btn-edit" onclick="editTicket(${ticket.id})">Tahrirlash</button>
            <button class="btn-small btn-delete" onclick="deleteTicket(${ticket.id})">O'chirish</button>
          </div>
        </td>
      `
      tbody.appendChild(row)
    })
}


function loadInventory() {
  const tbody = document.querySelector("#inventoryTable tbody")
  tbody.innerHTML = ""

  inventory.forEach((item) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>#${item.id}</td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toLocaleString()} so'm</td>
      <td>${item.supplier}</td>
      <td>${formatDate(item.lastUpdated)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-small btn-edit" onclick="editInventoryItem(${item.id})">Tahrirlash</button>
          <button class="btn-small btn-delete" onclick="deleteInventoryItem(${item.id})">O'chirish</button>
        </div>
      </td>
    `
    tbody.appendChild(row)
  })
}


function loadUsers() {
  const tbody = document.querySelector("#usersTable tbody")
  tbody.innerHTML = ""

  users
    .filter((user) => !user.isAdmin)
    .forEach((user) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>#${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.accountType === "personal" ? "Shaxsiy" : "Biznes"}</td>
        <td>${formatDate(user.createdAt)}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-small btn-view" onclick="viewUser(${user.id})">Ko'rish</button>
            <button class="btn-small btn-delete" onclick="deleteUser(${user.id})">O'chirish</button>
          </div>
        </td>
      `
      tbody.appendChild(row)
    })
}


function loadRecentActivity() {
  const tbody = document.querySelector("#adminRecentActivity tbody")
  tbody.innerHTML = ""
  const recentActivities = tickets
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 10)
    .map((ticket) => {
      const user = users.find((u) => u.id === ticket.userId) || { name: "Noma'lum foydalanuvchi" }
      return {
        time: ticket.updatedAt,
        activity: `So'rov "${ticket.title}" ${getStatusText(ticket.status)}`,
        user: user.name,
        status: ticket.status,
      }
    })

  recentActivities.forEach((activity) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${formatDate(activity.time)}</td>
      <td>${activity.activity}</td>
      <td>${activity.user}</td>
      <td><span class="status-badge status-${activity.status}">${getStatusText(activity.status)}</span></td>
    `
    tbody.appendChild(row)
  })
}


function showAdminSection(sectionName) {
  document.querySelectorAll(".dashboard-section").forEach((section) => {
    section.classList.add("hidden")
  })
  document.getElementById(`admin-${sectionName}-section`).classList.remove("hidden")
  document.querySelectorAll(".dashboard-nav a").forEach((link) => {
    link.classList.remove("active")
  })
  // Navdagi link active bo'lsin
  document.querySelectorAll(".dashboard-nav a").forEach((a) => {
    if (a.textContent.trim().toLowerCase().includes(sectionName.replace("-", " "))) {
      a.classList.add("active")
    }
  })
  currentAdminSection = sectionName
}




function editTicket(ticketId) {
  const ticket = tickets.find((t) => t.id === ticketId)
  if (!ticket) return
  document.getElementById("editTicketId").value = ticket.id
  document.getElementById("editTicketTitle").value = ticket.title
  document.getElementById("editTicketStatus").value = ticket.status
  document.getElementById("editTicketPriority").value = ticket.priority
  document.getElementById("editTicketDescription").value = ticket.description
  document.getElementById("editTicketSolution").value = ticket.solution || ""
  document.getElementById("editTicketModal").style.display = "block"
}



function handleEditTicket(e) {
  e.preventDefault()
  const ticketId = Number.parseInt(document.getElementById("editTicketId").value)
  const title = document.getElementById("editTicketTitle").value
  const status = document.getElementById("editTicketStatus").value
  const priority = document.getElementById("editTicketPriority").value
  const description = document.getElementById("editTicketDescription").value
  const solution = document.getElementById("editTicketSolution").value
  const ticketIndex = tickets.findIndex((t) => t.id === ticketId)
  if (ticketIndex !== -1) {
    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      title,
      status,
      priority,
      description,
      solution,
      updatedAt: new Date().toISOString(),
    }
    saveData()
    closeModal("editTicketModal")
    loadAdminDashboardData()
    alert("So'rov muvaffaqiyatli yangilandi!")
  }
}



function deleteTicket(ticketId) {
  if (confirm("Bu so'rovni o'chirishga ishonchingiz komilmi?")) {
    tickets = tickets.filter((t) => t.id !== ticketId)
    window.tickets = tickets
    saveData()
    loadAdminDashboardData()
    alert("So'rov muvaffaqiyatli o'chirildi!")
  }
}

// So'rov tafsilotlari modal
function viewAdminTicket(ticketId) {
  const ticket = tickets.find((t) => t.id === ticketId)
  if (!ticket) return
  const user = users.find((u) => u.id === ticket.userId) || {
    name: "Noma'lum foydalanuvchi",
    email: "N/A",
    phone: "N/A",
  }
  const ticketDetails = `
    <div class="ticket-info">
      <h3>So'rov #${ticket.id}: ${ticket.title}</h3>
      <div class="ticket-meta">
        <p><strong>Mijoz:</strong> ${ticket.customerName || user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Telefon:</strong> ${ticket.customerPhone || user.phone}</p>
        <p><strong>Hisob turi:</strong> ${ticket.customerType === "personal" ? "Shaxsiy" : "Biznes" || user.accountType}</p>
        <p><strong>Holat:</strong> <span class="status-badge status-${ticket.status}">${getStatusText(ticket.status)}</span></p>
        <p><strong>Muhimlik:</strong> <span class="priority-${ticket.priority}">${getPriorityText(ticket.priority)}</span></p>
        <p><strong>Kategoriya:</strong> ${ticket.category}</p>
        <p><strong>Yaratilgan:</strong> ${formatDate(ticket.createdAt)}</p>
        <p><strong>Oxirgi yangilanish:</strong> ${formatDate(ticket.updatedAt)}</p>
      </div>
      <div class="ticket-description">
        <h4>Tavsif:</h4>
        <p>${ticket.description}</p>
      </div>
      ${
        ticket.attachments && ticket.attachments.length > 0
          ? `<div class="ticket-attachments">
                <h4>Biriktirmalar:</h4>
                <ul>
                  ${ticket.attachments.map(
                    (attachment) =>
                      `<li>
                        <a href="${attachment.url}" target="_blank">${attachment.name}</a>
                        (${(attachment.size / 1024 / 1024).toFixed(2)} MB)
                      </li>`
                  ).join("")}
                </ul>
              </div>`
          : ""
      }
      ${
        ticket.solution
          ? `<div class="ticket-solution">
                <h4>Yechim:</h4>
                <p>${ticket.solution}</p>
              </div>`
          : ""
      }
    </div>
  `
  

  const modal = document.createElement("div")
  modal.className = "modal"
  modal.style.display = "block"
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2>So'rov Tafsilotlari</h2>
      ${ticketDetails}
    </div>
  `
  document.body.appendChild(modal)
}


function showAddInventoryModal() {
  document.getElementById("addInventoryModal").style.display = "block"
}


function handleAddInventory(e) {
  e.preventDefault()
  const name = document.getElementById("inventoryName").value
  const category = document.getElementById("inventoryCategory").value
  const quantity = Number.parseInt(document.getElementById("inventoryQuantity").value)
  const price = Number.parseFloat(document.getElementById("inventoryPrice").value)
  const supplier = document.getElementById("inventorySupplier").value

  const newItem = {
    id: generateId(),
    name,
    category,
    quantity,
    price,
    supplier,
    lastUpdated: new Date().toISOString(),
  }
  inventory.push(newItem)
  window.inventory = inventory
  saveData()
  document.getElementById("addInventoryForm").reset()
  closeModal("addInventoryModal")
  loadInventory()
  alert("Inventar elementi muvaffaqiyatli qo'shildi!")
}


function editInventoryItem(itemId) {
  const item = inventory.find((i) => i.id === itemId)
  if (!item) return
  const newQuantity = prompt("Yangi miqdorni kiriting:", item.quantity)
  if (newQuantity !== null && !isNaN(newQuantity)) {
    const itemIndex = inventory.findIndex((i) => i.id === itemId)
    inventory[itemIndex].quantity = Number.parseInt(newQuantity)
    inventory[itemIndex].lastUpdated = new Date().toISOString()
    window.inventory = inventory
    saveData()
    loadInventory()
    alert("Inventar muvaffaqiyatli yangilandi!")
  }
}


function deleteInventoryItem(itemId) {
  if (confirm("Bu inventar elementini o'chirishga ishonchingiz komilmi?")) {
    inventory = inventory.filter((i) => i.id !== itemId)
    window.inventory = inventory
    saveData()
    loadInventory()
    alert("Inventar elementi muvaffaqiyatli o'chirildi!")
  }
}


function filterTickets() {
  const statusFilter = document.getElementById("statusFilter").value
  const priorityFilter = document.getElementById("priorityFilter").value
  let filteredTickets = tickets
  if (statusFilter) {
    filteredTickets = filteredTickets.filter((ticket) => ticket.status === statusFilter)
  }
  if (priorityFilter) {
    filteredTickets = filteredTickets.filter((ticket) => ticket.priority === priorityFilter)
  }
  const tbody = document.querySelector("#adminTicketsTable tbody")
  tbody.innerHTML = ""
  filteredTickets
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach((ticket) => {
      const user = users.find((u) => u.id === ticket.userId) || { name: "Noma'lum foydalanuvchi" }
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>#${ticket.id}</td>
        <td>${ticket.customerName || user.name}</td>
        <td>${ticket.title}</td>
        <td><span class="status-badge status-${ticket.status}">${getStatusText(ticket.status)}</span></td>
        <td><span class="priority-${ticket.priority}">${getPriorityText(ticket.priority)}</span></td>
        <td>${ticket.category}</td>
        <td>${formatDate(ticket.createdAt)}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-small btn-view" onclick="viewAdminTicket(${ticket.id})">Ko'rish</button>
            <button class="btn-small btn-edit" onclick="editTicket(${ticket.id})">Tahrirlash</button>
            <button class="btn-small btn-delete" onclick="deleteTicket(${ticket.id})">O'chirish</button>
          </div>
        </td>
      `
      tbody.appendChild(row)
    })
}


function viewUser(userId) {
  const user = users.find((u) => u.id === userId)
  if (!user) return
  const userTickets = tickets.filter((t) => t.userId === userId)
  const userDetails = `
    <div class="user-info">
      <h3>Foydalanuvchi tafsilotlari: ${user.name}</h3>
      <div class="user-meta">
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Telefon:</strong> ${user.phone}</p>
        <p><strong>Hisob turi:</strong> ${user.accountType === "personal" ? "Shaxsiy" : "Biznes"}</p>
        <p><strong>Qo'shilgan:</strong> ${formatDate(user.createdAt)}</p>
        <p><strong>Jami so'rovlar:</strong> ${userTickets.length}</p>
      </div>
      <div class="user-tickets">
        <h4>So'nggi so'rovlar:</h4>
        <ul>
          ${userTickets
            .slice(0, 5)
            .map(
              (ticket) => `
                <li>
                  #${ticket.id}: ${ticket.title} 
                  <span class="status-badge status-${ticket.status}">${getStatusText(ticket.status)}</span>
                </li>
              `
            )
            .join("")}
        </ul>
      </div>
    </div>
  `
  const modal = document.createElement("div")
  modal.className = "modal"
  modal.style.display = "block"
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2>Foydalanuvchi Ma'lumotlari</h2>
      ${userDetails}
    </div>
  `
  document.body.appendChild(modal)
}

// Foydalanuvchini o'chirish
function deleteUser(userId) {
  if (confirm("Bu foydalanuvchini o'chirishga ishonchingiz komilmi? Bu uning barcha so'rovlarini ham o'chiradi.")) {
    users = users.filter((u) => u.id !== userId)
    tickets = tickets.filter((t) => t.userId !== userId)
    window.users = users
    window.tickets = tickets
    saveData()
    loadAdminDashboardData()
    alert("Foydalanuvchi muvaffaqiyatli o'chirildi!")
  }
}

// Chiqish
function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "/public/index.html"
}

// *** ADMIN STYLES ***
const adminStyles = `
  .analytics-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 15px;
      text-align: center;
  }
  .analytics-card h4 { margin-bottom: 15px; font-size: 1.1rem; }
  .metric {
      display: flex; flex-direction: column; align-items: center;
  }
  .metric-value { font-size: 2.5rem; font-weight: bold; margin-bottom: 5px; }
  .metric-unit { font-size: 0.9rem; opacity: 0.9; }
  .issue-item { padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.2); font-size: 0.9rem;}
  .issue-item:last-child { border-bottom: none;}
  .filters { display: flex; gap: 15px; flex-wrap: wrap;}
  .filters select { padding: 8px 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 0.9rem;}
  .priority-low { color: #28a745; }
  .priority-medium { color: #ffc107; }
  .priority-high { color: #fd7e14; }
  .priority-urgent { color: #dc3545; }
`
const styleSheet = document.createElement("style")
styleSheet.textContent = adminStyles
document.head.appendChild(styleSheet)