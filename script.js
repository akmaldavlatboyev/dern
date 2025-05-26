// GLOBAL variables (window orqali)
window.currentUser = null
window.tickets = []
window.users = []
window.knowledgeBase = []
window.inventory = []

// ---- DATA LOADING & SAVING ----
window.loadData = function() {
  // Users
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
      }
    ]
    window.saveData()
  }

  // Tickets
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

  // Inventory
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

window.saveData = function() {
  localStorage.setItem("dern_users", JSON.stringify(window.users))
  localStorage.setItem("dern_tickets", JSON.stringify(window.tickets))
  localStorage.setItem("dern_inventory", JSON.stringify(window.inventory))
}

// ---- MODAL FUNCTIONS ----
window.closeModal = function(modalId) {
  document.getElementById(modalId).style.display = "none"
}

window.showLoginModal = function() {
  document.getElementById("loginModal").style.display = "block"
}

window.showRegisterModal = function() {
  document.getElementById("registerModal").style.display = "block"
}

// ---- DATE & ID UTILS ----
window.formatDate = function(dateString) {
  return new Date(dateString).toLocaleDateString("uz-UZ")
}

window.generateId = function() {
  return Date.now() + Math.floor(Math.random() * 1000)
}

// ---- KNOWLEDGE BASE ----
window.loadKnowledgeBase = function() {
  window.knowledgeBase = [
    {
      id: 1,
      title: "Kompyuter Ishga Tushmayapti - Muammolarni Hal Qilish",
      category: "hardware",
      content: "1-qadam: Quvvat ulanishlarini tekshiring. 2-qadam: Quvvat blokini sinab ko'ring. 3-qadam: RAM modullarini tekshiring. 4-qadam: Anakartni shikastlanish uchun ko'zdan kechiring.",
      tags: ["quvvat", "ishga tushirish", "apparat"],
      views: 1250,
    },
    {
      id: 2,
      title: "Sekin Kompyuter Ishlashi Yechimlari",
      category: "performance",
      content: "1-qadam: Disk tozalashni ishga tushiring. 2-qadam: Zararli dasturlarni tekshiring. 3-qadam: Drayverlani yangilang. 4-qadam: Kerak bo'lsa ko'proq RAM qo'shing.",
      tags: ["ishlash", "sekin", "optimallashtirish"],
      views: 980,
    },
    {
      id: 3,
      title: "WiFi Ulanish Muammolari",
      category: "network",
      content: "1-qadam: Router va modemni qayta ishga tushiring. 2-qadam: Tarmoq drayverlarini yangilang. 3-qadam: Tarmoq sozlamalarini tiklang. 4-qadam: Interferensiyani tekshiring.",
      tags: ["wifi", "tarmoq", "ulanish"],
      views: 756,
    },
    {
      id: 4,
      title: "Ko'k Ekran Xatosi (BSOD) Tuzatish",
      category: "software",
      content: "1-qadam: Xato kodini yozib oling. 2-qadam: Xavfsiz rejimda yuklang. 3-qadam: Drayverlani yangilang yoki qaytaring. 4-qadam: Xotira diagnostikasini ishga tushiring.",
      tags: ["bsod", "buzilish", "windows"],
      views: 642,
    },
    {
      id: 5,
      title: "Virus va Zararli Dasturlarni Olib Tashlash",
      category: "security",
      content: "1-qadam: Antivirus qutqaruv diskidan yuklang. 2-qadam: To'liq tizim skanini ishga tushiring. 3-qadam: Aniqlangan tahdidlarni olib tashlang. 4-qadam: Xavfsizlik dasturini yangilang.",
      tags: ["virus", "zararli dastur", "xavfsizlik"],
      views: 1100,
    }
  ]
  window.displayKnowledgeBase()
}

window.displayKnowledgeBase = function(articles = window.knowledgeBase) {
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

window.searchKnowledgeBase = function() {
  const searchTerm = document.getElementById("kb-search").value.toLowerCase()
  if (!searchTerm) {
    window.displayKnowledgeBase()
    return
  }
  const filteredArticles = window.knowledgeBase.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
  )
  window.displayKnowledgeBase(filteredArticles)
}

// ---- LOGIN & REGISTRATION ----
window.handleLogin = function(e) {
  e.preventDefault()
  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value
  const isAdmin = document.getElementById("isAdmin") ? document.getElementById("isAdmin").checked : false

  // Find user
  const user = window.users.find((u) => u.email === email && u.password === password)
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
  window.currentUser = user
  localStorage.setItem("currentUser", JSON.stringify(user))
  window.closeModal("loginModal")
  if (isAdmin && user.isAdmin) {
    window.location.href = "admin.html"
  } else {
    window.location.href = "dashboard.html"
  }
}

window.handleRegister = function(e) {
  e.preventDefault()
  const name = document.getElementById("registerName").value
  const email = document.getElementById("registerEmail").value
  const phone = document.getElementById("registerPhone").value
  const password = document.getElementById("registerPassword").value
  const accountType = document.getElementById("accountType").value

  if (window.users.find((u) => u.email === email)) {
    alert("Bu email bilan foydalanuvchi allaqachon mavjud")
    return
  }
  // Create new user
  const newUser = {
    id: window.users.length + 1,
    name,
    email,
    phone,
    password,
    accountType,
    isAdmin: false,
    createdAt: new Date().toISOString(),
  }
  window.users.push(newUser)
  window.saveData()
  alert("Hisob muvaffaqiyatli yaratildi! Iltimos, tizimga kiring.")
  window.closeModal("registerModal")
  window.showLoginModal()
}

// ---- EVENT LISTENERS ----
document.addEventListener("DOMContentLoaded", () => {
  window.loadData()
  window.loadKnowledgeBase()

  // LOGIN FORM
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", window.handleLogin)
  }

  // REGISTER FORM
  const registerForm = document.getElementById("registerForm")
  if (registerForm) {
    registerForm.addEventListener("submit", window.handleRegister)
  }

  // KB SEARCH
  const kbSearch = document.getElementById("kb-search")
  if (kbSearch) {
    kbSearch.addEventListener("input", window.searchKnowledgeBase)
  }

  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })
  }
})

// Close modals when clicking outside
window.onclick = function(event) {
  const modals = document.querySelectorAll(".modal")
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none"
    }
  })
}
