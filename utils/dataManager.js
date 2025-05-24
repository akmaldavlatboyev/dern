const fs = require("fs")
const path = require("path")

// Data file paths
const DATA_DIR = path.join(__dirname, "..", "data")
const USERS_FILE = path.join(DATA_DIR, "users.json")
const TICKETS_FILE = path.join(DATA_DIR, "tickets.json")
const INVENTORY_FILE = path.join(DATA_DIR, "inventory.json")
const KNOWLEDGE_BASE_FILE = path.join(DATA_DIR, "knowledgeBase.json")

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Generic data manager
class DataManager {
  static readData(filename) {
    try {
      const filePath = path.join(DATA_DIR, filename)
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf8")
        return JSON.parse(data)
      }
      return []
    } catch (error) {
      console.error(`Ma'lumotlarni o'qishda xatolik (${filename}):`, error)
      return []
    }
  }

  static writeData(filename, data) {
    try {
      const filePath = path.join(DATA_DIR, filename)
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
      return true
    } catch (error) {
      console.error(`Ma'lumotlarni yozishda xatolik (${filename}):`, error)
      return false
    }
  }

  // Users
  static getUsers() {
    return this.readData("users.json")
  }

  static saveUsers(users) {
    return this.writeData("users.json", users)
  }

  static getUserById(id) {
    const users = this.getUsers()
    return users.find((user) => user.id === Number.parseInt(id))
  }

  static getUserByEmail(email) {
    const users = this.getUsers()
    return users.find((user) => user.email === email)
  }

  // Tickets
  static getTickets() {
    return this.readData("tickets.json")
  }

  static saveTickets(tickets) {
    return this.writeData("tickets.json", tickets)
  }

  static getTicketById(id) {
    const tickets = this.getTickets()
    return tickets.find((ticket) => ticket.id === Number.parseInt(id))
  }

  static getTicketsByUserId(userId) {
    const tickets = this.getTickets()
    return tickets.filter((ticket) => ticket.userId === Number.parseInt(userId))
  }

  // Inventory
  static getInventory() {
    return this.readData("inventory.json")
  }

  static saveInventory(inventory) {
    return this.writeData("inventory.json", inventory)
  }

  static getInventoryById(id) {
    const inventory = this.getInventory()
    return inventory.find((item) => item.id === Number.parseInt(id))
  }

  // Knowledge Base
  static getKnowledgeBase() {
    return this.readData("knowledgeBase.json")
  }

  static saveKnowledgeBase(knowledgeBase) {
    return this.writeData("knowledgeBase.json", knowledgeBase)
  }

  static searchKnowledgeBase(query) {
    const knowledgeBase = this.getKnowledgeBase()
    const searchTerm = query.toLowerCase()

    return knowledgeBase.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )
  }

  // Utility methods
  static generateId() {
    return Date.now() + Math.floor(Math.random() * 1000)
  }

  static backup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const backupDir = path.join(DATA_DIR, "backups", timestamp)

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    const files = ["users.json", "tickets.json", "inventory.json", "knowledgeBase.json"]

    files.forEach((file) => {
      const sourcePath = path.join(DATA_DIR, file)
      const backupPath = path.join(backupDir, file)

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, backupPath)
      }
    })

    console.log(`Backup yaratildi: ${backupDir}`)
    return backupDir
  }
}

module.exports = DataManager
