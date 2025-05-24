const DataManager = require("./dataManager")
const bcrypt = require("bcryptjs")

function initializeData() {
  console.log("Ma'lumotlar bazasini ishga tushirish...")

  // Initialize users
  const users = DataManager.getUsers()
  if (users.length === 0) {
    const defaultUsers = [
      {
        id: 1,
        name: "Admin Foydalanuvchi",
        email: "admin@dern-support.com",
        phone: "+998-90-000-0000",
        password: bcrypt.hashSync("admin123", 10),
        accountType: "admin",
        isAdmin: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Test Mijoz",
        email: "test@example.com",
        phone: "+998-90-123-4567",
        password: bcrypt.hashSync("test123", 10),
        accountType: "personal",
        isAdmin: false,
        createdAt: new Date().toISOString(),
      },
    ]

    DataManager.saveUsers(defaultUsers)
    console.log("✅ Standart foydalanuvchilar yaratildi")
  }

  // Initialize tickets
  const tickets = DataManager.getTickets()
  if (tickets.length === 0) {
    const defaultTickets = [
      {
        id: 1,
        userId: 2,
        title: "Kompyuter ishga tushmayapti",
        description: "Mening kompyuterim to'satdan ishlamay qoldi va yoqilmayapti.",
        status: "completed",
        priority: "high",
        category: "hardware",
        customerName: "Test Mijoz",
        customerPhone: "+998-90-123-4567",
        customerType: "personal",
        attachments: [],
        solution: "Buzilgan quvvat bloki almashtirildi. Tizim endi normal ishlayapti.",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        userId: 2,
        title: "Dasturiy ta'minot o'rnatish muammosi",
        description: "Yangi dasturni o'rnatishda muammo bor.",
        status: "pending",
        priority: "medium",
        category: "software",
        customerName: "Test Mijoz",
        customerPhone: "+998-90-123-4567",
        customerType: "personal",
        attachments: [],
        solution: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    DataManager.saveTickets(defaultTickets)
    console.log("✅ Standart ticketlar yaratildi")
  }

  // Initialize inventory
  const inventory = DataManager.getInventory()
  if (inventory.length === 0) {
    const defaultInventory = [
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

    DataManager.saveInventory(defaultInventory)
    console.log("✅ Standart inventar yaratildi")
  }

  // Initialize knowledge base
  const knowledgeBase = DataManager.getKnowledgeBase()
  if (knowledgeBase.length === 0) {
    const defaultKnowledgeBase = [
      {
        id: 1,
        title: "Kompyuter Ishga Tushmayapti - Muammolarni Hal Qilish",
        category: "hardware",
        content:
          "1-qadam: Quvvat ulanishlarini tekshiring. 2-qadam: Quvvat blokini sinab ko'ring. 3-qadam: RAM modullarini tekshiring. 4-qadam: Anakartni shikastlanish uchun ko'zdan kechiring.",
        tags: ["quvvat", "ishga tushirish", "apparat"],
        views: 1250,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Sekin Kompyuter Ishlashi Yechimlari",
        category: "performance",
        content:
          "1-qadam: Disk tozalashni ishga tushiring. 2-qadam: Zararli dasturlarni tekshiring. 3-qadam: Drayverlani yangilang. 4-qadam: Kerak bo'lsa ko'proq RAM qo'shing.",
        tags: ["ishlash", "sekin", "optimallashtirish"],
        views: 980,
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        title: "WiFi Ulanish Muammolari",
        category: "network",
        content:
          "1-qadam: Router va modemni qayta ishga tushiring. 2-qadam: Tarmoq drayverlarini yangilang. 3-qadam: Tarmoq sozlamalarini tiklang. 4-qadam: Interferensiyani tekshiring.",
        tags: ["wifi", "tarmoq", "ulanish"],
        views: 756,
        createdAt: new Date().toISOString(),
      },
    ]

    DataManager.saveKnowledgeBase(defaultKnowledgeBase)
    console.log("✅ Standart bilimlar bazasi yaratildi")
  }

  console.log("🎉 Ma'lumotlar bazasi muvaffaqiyatli ishga tushirildi!")
}

module.exports = { initializeData }
