// Admin dashboard functionality
let currentAdminSection = "overview"
let currentUser
let tickets = window.tickets
let users = window.users
let inventory = window.inventory
let loadData = window.loadData
let saveData = window.saveData
let formatDate = window.formatDate
let generateId = window.generateId
let closeModal = window.closeModal

// Declare getStatusText and getPriorityText functions
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

// Initialize admin dashboard
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is admin
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

// ... (Qolgan funksiyalar, ya'ni updateAdminStats, loadAdminTickets, loadInventory, loadUsers, loadRecentActivity, showAdminSection, editTicket, handleEditTicket, deleteTicket, viewAdminTicket, showAddInventoryModal, handleAddInventory, editInventoryItem, deleteInventoryItem, filterTickets, viewUser, deleteUser, logout va h.k. -- AVVALGI KODINGIZDAGI KABI QOLADI, hech narsa o'zgartirmasdan!)

/* Quyida, kodingiz uzunligi tufayli, ularni xuddi siz yuborgandek joylashtiring yoki xohlasangiz, men alohida fayl qilib eksport qilib bera olaman. 
Barcha funksiyalar o'sha-o'sha ishlaydi, faqat har safar tickets, users, inventory va boshqa window global qiymatlari bilan ishlashga ishonch hosil qiling.
*/

// Yordamchi CSS kiritish va boshqa qismlar ham xuddi sizda bo'lgani kabi qoladi.
