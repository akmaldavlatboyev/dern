// Dashboard specific functionality
let currentSection = "overview"

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const savedUser = localStorage.getItem("currentUser")
  if (!savedUser) {
    window.location.href = "index.html"
    return
  }

  currentUser = JSON.parse(savedUser)

  // Update welcome message
  document.getElementById("userWelcome").textContent = `Xush kelibsiz, ${currentUser.name}`

  // Load dashboard data
  loadDashboardData()

  // Setup event listeners
  setupDashboardEventListeners()

  // Show overview section by default
  showSection("overview")
})

// Setup dashboard event listeners
function setupDashboardEventListeners() {
  // New ticket form
  document.getElementById("newTicketForm").addEventListener("submit", handleNewTicket)

  // Knowledge base search
  document.getElementById("dashboardKbSearch").addEventListener("input", searchDashboardKB)
}

// Load dashboard data
function loadDashboardData() {
  loadData() // Load from localStorage
  updateDashboardStats()
  loadRecentTickets()
  loadAllTickets()
  loadDashboardKnowledgeBase()
}

// Update dashboard statistics
function updateDashboardStats() {
  const userTickets = tickets.filter((ticket) => ticket.userId === currentUser.id)
  const pendingTickets = userTickets.filter((ticket) => ticket.status === "pending" || ticket.status === "in-progress")
  const completedTickets = userTickets.filter((ticket) => ticket.status === "completed")

  document.getElementById("totalTickets").textContent = userTickets.length
  document.getElementById("pendingTickets").textContent = pendingTickets.length
  document.getElementById("completedTickets").textContent = completedTickets.length
}

// Load recent tickets
function loadRecentTickets() {
  const userTickets = tickets
    .filter((ticket) => ticket.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const tbody = document.querySelector("#recentTicketsTable tbody")
  tbody.innerHTML = ""

  userTickets.forEach((ticket) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>#${ticket.id}</td>
            <td>${ticket.title}</td>
            <td><span class="status-badge status-${ticket.status}">${getStatusText(ticket.status)}</span></td>
            <td>${formatDate(ticket.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-view" onclick="viewTicket(${ticket.id})">Ko'rish</button>
                </div>
            </td>
        `
    tbody.appendChild(row)
  })
}

// Load all tickets
function loadAllTickets() {
  const userTickets = tickets
    .filter((ticket) => ticket.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const tbody = document.querySelector("#allTicketsTable tbody")
  tbody.innerHTML = ""

  userTickets.forEach((ticket) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>#${ticket.id}</td>
            <td>${ticket.title}</td>
            <td><span class="status-badge status-${ticket.status}">${getStatusText(ticket.status)}</span></td>
            <td><span class="priority-${ticket.priority}">${getPriorityText(ticket.priority)}</span></td>
            <td>${formatDate(ticket.createdAt)}</td>
            <td>${formatDate(ticket.updatedAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-view" onclick="viewTicket(${ticket.id})">Ko'rish</button>
                </div>
            </td>
        `
    tbody.appendChild(row)
  })
}

// Get status text in Uzbek
function getStatusText(status) {
  const statusMap = {
    pending: "Kutilayotgan",
    "in-progress": "Jarayonda",
    completed: "Bajarilgan",
    cancelled: "Bekor qilingan",
  }
  return statusMap[status] || status
}

// Get priority text in Uzbek
function getPriorityText(priority) {
  const priorityMap = {
    low: "Past",
    medium: "O'rta",
    high: "Yuqori",
    urgent: "Shoshilinch",
  }
  return priorityMap[priority] || priority
}

// Load knowledge base for dashboard
function loadDashboardKnowledgeBase() {
  displayDashboardKnowledgeBase()
}

// Display knowledge base in dashboard
function displayDashboardKnowledgeBase(articles = knowledgeBase) {
  const kbResults = document.getElementById("dashboardKbResults")
  kbResults.innerHTML = ""

  articles.forEach((article) => {
    const articleElement = document.createElement("div")
    articleElement.className = "kb-article"
    articleElement.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.content}</p>
            <div style="margin-top: 15px; font-size: 0.9rem; color: #666;">
                <span>Kategoriya: ${article.category}</span> | 
                <span>Ko'rishlar: ${article.views}</span>
            </div>
        `
    kbResults.appendChild(articleElement)
  })
}

// Search knowledge base in dashboard
function searchDashboardKB() {
  const searchTerm = document.getElementById("dashboardKbSearch").value.toLowerCase()

  if (!searchTerm) {
    displayDashboardKnowledgeBase()
    return
  }

  const filteredArticles = knowledgeBase.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
  )

  displayDashboardKnowledgeBase(filteredArticles)
}

// Show dashboard section
function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll(".dashboard-section").forEach((section) => {
    section.classList.add("hidden")
  })

  // Show selected section
  document.getElementById(`${sectionName}-section`).classList.remove("hidden")

  // Update navigation
  document.querySelectorAll(".dashboard-nav a").forEach((link) => {
    link.classList.remove("active")
  })

  // Find and activate the correct nav link
  const navLinks = document.querySelectorAll(".dashboard-nav a")
  navLinks.forEach((link) => {
    if (link.onclick && link.onclick.toString().includes(`showSection('${sectionName}')`)) {
      link.classList.add("active")
    }
  })

  currentSection = sectionName
}

// Handle new ticket submission
function handleNewTicket(e) {
  e.preventDefault()

  const title = document.getElementById("ticketTitle").value
  const category = document.getElementById("ticketCategory").value
  const priority = document.getElementById("ticketPriority").value
  const description = document.getElementById("ticketDescription").value
  const attachments = document.getElementById("ticketAttachments").files

  // Process attachments using file-storage.js
  handleFileUpload(attachments).then((attachmentList) => {
    // Create new ticket
    const newTicket = {
      id: generateId(),
      userId: currentUser.id,
      title,
      description,
      status: "pending",
      priority,
      category,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      customerType:\
