// Global variables
window.currentUser = null
window.tickets = []
window.users = []
window.knowledgeBase = []
window.inventory = []

// Load data from localStorage or initialize with default data
window.loadData = function () {
  // Load users
  const savedUsers = localStorage.getItem("dern_users")
  if (savedUsers) {
    window.users = JSON.parse(savedUsers)
  } else {
    window.users = [
      {
        id: 1,
        name: "Admin Foydalanuvchi",
        email: "admin@dern-support.com",
        phone: "+998-90-000-0000",
        password: "admin123",
        accountType: "admin",
        isAdmin: true,
        createdAt: new Date().toISOString(),
      },
    ]
    window.saveData()
  }

  // Load tickets
  const savedTickets = localStorage.getItem("dern_tickets")
  if (savedTickets) {
    window.tickets = JSON.parse(savedTickets)
  } else {
    window.tickets = [
      {
        id: 1,
        userId: 1,
        title: "Kompyuter ishga tushmayapti",
        description: "Mening kompyuterim to'satdan ishlamay qoldi va yoqilmayapti.",
        status: "completed",
        priority: "high",
        category: "hardware",
        customerName: "Akmal Karimov",
        customerPhone: "+998-90-123-4567",
        customerType: "personal",
        attachments: [],
        solution: "Buzilgan quvvat bloki almashtirildi. Tizim endi normal ishlayapti.",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-16T14:20:00Z",
      },
      {
        id: 2,
        userId: 2,
        title: "Dasturiy ta'minot o'rnatish muammosi",
        description: "Ofis kompyuterlariga yangi buxgalteriya dasturini o'rnatib bo'lmayapti.",
        status: "in-progress",
        priority: "medium",
        category: "software",
        customerName: "Tech Solutions MChJ",
        customerPhone: "+998-90-567-8901",
        customerType: "business",
        attachments: [],
        solution: "",
        createdAt: "2024-01-16T09:15:00Z",
        updatedAt: "2024-01-16T09:15:00Z",
      },
    ]
    window.saveData()
  }

  // Load inventory
  const savedInventory = localStorage.getItem("dern_inventory")
  if (savedInventory) {
    window.inventory = JSON.parse(savedInventory)
  } else {
    window.inventory = [
      {
        id: 1,
        name: "Quvvat Bloki 650W",
        category: "hardware",
        quantity: 15,
        price: 450000,
        supplier: "TechParts MChJ",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 2,
        name: "RAM DDR4 16GB",
        category: "hardware",
        quantity: 8,
        price: 650000,
        supplier: "Memory World",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 3,
        name: "Windows 11 Pro Litsenziya",
        category: "software",
        quantity: 25,
        price: 1000000,
        supplier: "Microsoft",
        lastUpdated: new Date().toISOString(),
      },
    ]
    window.saveData()
  }
}

// Save data to localStorage
window.saveData = function () {
  localStorage.setItem("dern_users", JSON.stringify(window.users))
  localStorage.setItem("dern_tickets", JSON.stringify(window.tickets))
  localStorage.setItem("dern_inventory", JSON.stringify(window.inventory))
}

// Modal functions
window.closeModal = function(modalId) {
  document.getElementById(modalId).style.display = "none"
}

// Utility functions
window.formatDate = function(dateString) {
  return new Date(dateString).toLocaleDateString("uz-UZ")
}
window.generateId = function() {
  return Date.now() + Math.floor(Math.random() * 1000)
}

// Qolgan funksiyalar (login, register, KB va boshqalar) sizda ishlasa shu holda qolsin!
// Faqat, agar kerak bo'lsa, hammasini window orqali export qiling.

// Example: 
// window.handleLogin = handleLogin
// window.handleRegister = handleRegister
// ...

// End!
