// Global variables
let currentUser = null
let tickets = []
let users = []
let knowledgeBase = []
let inventory = []

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  loadData()
  loadKnowledgeBase()
  setupEventListeners()
})

// Setup event listeners
function setupEventListeners() {
  // Login form
  document.getElementById("loginForm").addEventListener("submit", handleLogin)

  // Register form
  document.getElementById("registerForm").addEventListener("submit", handleRegister)

  // Knowledge base search
  document.getElementById("kb-search").addEventListener("input", searchKnowledgeBase)

  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })
  }
}

// Load data from localStorage or initialize with default data
function loadData() {
  // Load users
  const savedUsers = localStorage.getItem("dern_users")
  if (savedUsers) {
    users = JSON.parse(savedUsers)
  } else {
    // Initialize with admin user
    users = [
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
    saveData()
  }

  // Load tickets
  const savedTickets = localStorage.getItem("dern_tickets")
  if (savedTickets) {
    tickets = JSON.parse(savedTickets)
  } else {
    // Initialize with sample tickets
    tickets = [
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
    saveData()
  }

  // Load inventory
  const savedInventory = localStorage.getItem("dern_inventory")
  if (savedInventory) {
    inventory = JSON.parse(savedInventory)
  } else {
    // Initialize with sample inventory
    inventory = [
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
    saveData()
  }
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("dern_users", JSON.stringify(users))
  localStorage.setItem("dern_tickets", JSON.stringify(tickets))
  localStorage.setItem("dern_inventory", JSON.stringify(inventory))
}

// Load knowledge base articles
function loadKnowledgeBase() {
  knowledgeBase = [
    {
      id: 1,
      title: "Kompyuter Ishga Tushmayapti - Muammolarni Hal Qilish",
      category: "hardware",
      content:
        "1-qadam: Quvvat ulanishlarini tekshiring. 2-qadam: Quvvat blokini sinab ko'ring. 3-qadam: RAM modullarini tekshiring. 4-qadam: Anakartni shikastlanish uchun ko'zdan kechiring.",
      tags: ["quvvat", "ishga tushirish", "apparat"],
      views: 1250,
    },
    {
      id: 2,
      title: "Sekin Kompyuter Ishlashi Yechimlari",
      category: "performance",
      content:
        "1-qadam: Disk tozalashni ishga tushiring. 2-qadam: Zararli dasturlarni tekshiring. 3-qadam: Drayverlani yangilang. 4-qadam: Kerak bo'lsa ko'proq RAM qo'shing.",
      tags: ["ishlash", "sekin", "optimallashtirish"],
      views: 980,
    },
    {
      id: 3,
      title: "WiFi Ulanish Muammolari",
      category: "network",
      content:
        "1-qadam: Router va modemni qayta ishga tushiring. 2-qadam: Tarmoq drayverlarini yangilang. 3-qadam: Tarmoq sozlamalarini tiklang. 4-qadam: Interferensiyani tekshiring.",
      tags: ["wifi", "tarmoq", "ulanish"],
      views: 756,
    },
    {
      id: 4,
      title: "Ko'k Ekran Xatosi (BSOD) Tuzatish",
      category: "software",
      content:
        "1-qadam: Xato kodini yozib oling. 2-qadam: Xavfsiz rejimda yuklang. 3-qadam: Drayverlani yangilang yoki qaytaring. 4-qadam: Xotira diagnostikasini ishga tushiring.",
      tags: ["bsod", "buzilish", "windows"],
      views: 642,
    },
    {
      id: 5,
      title: "Virus va Zararli Dasturlarni Olib Tashlash",
      category: "security",
      content:
        "1-qadam: Antivirus qutqaruv diskidan yuklang. 2-qadam: To'liq tizim skanini ishga tushiring. 3-qadam: Aniqlangan tahdidlarni olib tashlang. 4-qadam: Xavfsizlik dasturini yangilang.",
      tags: ["virus", "zararli dastur", "xavfsizlik"],
      views: 1100,
    },
  ]

  displayKnowledgeBase()
}

// Display knowledge base articles
function displayKnowledgeBase(articles = knowledgeBase) {
  const kbResults = document.getElementById("kb-results")
  if (!kbResults) return

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

// Search knowledge base
function searchKnowledgeBase() {
  const searchTerm = document.getElementById("kb-search").value.toLowerCase()

  if (!searchTerm) {
    displayKnowledgeBase()
    return
  }

  const filteredArticles = knowledgeBase.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
  )

  displayKnowledgeBase(filteredArticles)
}

// Modal functions
function showLoginModal() {
  document.getElementById("loginModal").style.display = "block"
}

function showRegisterModal() {
  document.getElementById("registerModal").style.display = "block"
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
}

// Handle login
function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value
  const isAdmin = document.getElementById("isAdmin").checked

  // Find user
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    alert("Noto'g'ri email yoki parol")
    return
  }

  // Check admin access
  if (isAdmin && !user.isAdmin) {
    alert("Sizda admin huquqlari yo'q")
    return
  }

  // Login successful
  currentUser = user
  localStorage.setItem("currentUser", JSON.stringify(user))
  closeModal("loginModal")

  if (isAdmin && user.isAdmin) {
    window.location.href = "admin.html"
  } else {
    window.location.href = "dashboard.html"
  }
}

// Handle registration
function handleRegister(e) {
  e.preventDefault()

  const name = document.getElementById("registerName").value
  const email = document.getElementById("registerEmail").value
  const phone = document.getElementById("registerPhone").value
  const password = document.getElementById("registerPassword").value
  const accountType = document.getElementById("accountType").value

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    alert("Bu email bilan foydalanuvchi allaqachon mavjud")
    return
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    phone,
    password,
    accountType,
    isAdmin: false,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveData()

  alert("Hisob muvaffaqiyatli yaratildi! Iltimos, tizimga kiring.")
  closeModal("registerModal")
  showLoginModal()
}

// Utility functions
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("uz-UZ")
}

function generateId() {
  return Date.now() + Math.random()
}

// Close modals when clicking outside
window.onclick = (event) => {
  const modals = document.querySelectorAll(".modal")
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none"
    }
  })
}
