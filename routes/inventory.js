const express = require("express")
const DataManager = require("../utils/dataManager")
const { verifyToken, requireAdmin } = require("../middleware/auth")

const router = express.Router()

// Get all inventory items (admin only)
router.get("/", verifyToken, requireAdmin, (req, res) => {
  try {
    const inventory = DataManager.getInventory()

    // Apply filters
    const { category, lowStock } = req.query
    let filteredInventory = inventory

    if (category) {
      filteredInventory = filteredInventory.filter((item) => item.category === category)
    }

    if (lowStock === "true") {
      filteredInventory = filteredInventory.filter((item) => item.quantity < 10)
    }

    // Sort by name
    filteredInventory.sort((a, b) => a.name.localeCompare(b.name))

    res.json({ inventory: filteredInventory })
  } catch (error) {
    console.error("Inventarni olishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Get single inventory item
router.get("/:id", verifyToken, requireAdmin, (req, res) => {
  try {
    const item = DataManager.getInventoryById(req.params.id)

    if (!item) {
      return res.status(404).json({ error: "Inventar elementi topilmadi" })
    }

    res.json({ item })
  } catch (error) {
    console.error("Inventar elementini olishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Create new inventory item
router.post("/", verifyToken, requireAdmin, (req, res) => {
  try {
    const { name, category, quantity, price, supplier } = req.body

    // Validation
    if (!name || !category || quantity === undefined || price === undefined || !supplier) {
      return res.status(400).json({ error: "Barcha maydonlar talab qilinadi" })
    }

    if (quantity < 0 || price < 0) {
      return res.status(400).json({ error: "Miqdor va narx manfiy bo'lishi mumkin emas" })
    }

    const inventory = DataManager.getInventory()
    const newItem = {
      id: DataManager.generateId(),
      name,
      category,
      quantity: Number.parseInt(quantity),
      price: Number.parseFloat(price),
      supplier,
      lastUpdated: new Date().toISOString(),
    }

    inventory.push(newItem)
    DataManager.saveInventory(inventory)

    res.status(201).json({
      message: "Inventar elementi muvaffaqiyatli yaratildi",
      item: newItem,
    })
  } catch (error) {
    console.error("Inventar elementini yaratishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Update inventory item
router.put("/:id", verifyToken, requireAdmin, (req, res) => {
  try {
    const inventory = DataManager.getInventory()
    const itemIndex = inventory.findIndex((item) => item.id === Number.parseInt(req.params.id))

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Inventar elementi topilmadi" })
    }

    const { name, category, quantity, price, supplier } = req.body

    // Validation
    if (quantity !== undefined && quantity < 0) {
      return res.status(400).json({ error: "Miqdor manfiy bo'lishi mumkin emas" })
    }

    if (price !== undefined && price < 0) {
      return res.status(400).json({ error: "Narx manfiy bo'lishi mumkin emas" })
    }

    // Update fields
    const item = inventory[itemIndex]
    if (name !== undefined) item.name = name
    if (category !== undefined) item.category = category
    if (quantity !== undefined) item.quantity = Number.parseInt(quantity)
    if (price !== undefined) item.price = Number.parseFloat(price)
    if (supplier !== undefined) item.supplier = supplier
    item.lastUpdated = new Date().toISOString()

    inventory[itemIndex] = item
    DataManager.saveInventory(inventory)

    res.json({
      message: "Inventar elementi muvaffaqiyatli yangilandi",
      item,
    })
  } catch (error) {
    console.error("Inventar elementini yangilashda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Delete inventory item
router.delete("/:id", verifyToken, requireAdmin, (req, res) => {
  try {
    const inventory = DataManager.getInventory()
    const itemIndex = inventory.findIndex((item) => item.id === Number.parseInt(req.params.id))

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Inventar elementi topilmadi" })
    }

    inventory.splice(itemIndex, 1)
    DataManager.saveInventory(inventory)

    res.json({ message: "Inventar elementi muvaffaqiyatli o'chirildi" })
  } catch (error) {
    console.error("Inventar elementini o'chirishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Get inventory statistics
router.get("/stats/overview", verifyToken, requireAdmin, (req, res) => {
  try {
    const inventory = DataManager.getInventory()

    const stats = {
      totalItems: inventory.length,
      totalValue: inventory.reduce((sum, item) => sum + item.quantity * item.price, 0),
      lowStockItems: inventory.filter((item) => item.quantity < 10).length,
      outOfStockItems: inventory.filter((item) => item.quantity === 0).length,
      byCategory: {
        hardware: inventory.filter((item) => item.category === "hardware").length,
        software: inventory.filter((item) => item.category === "software").length,
        accessories: inventory.filter((item) => item.category === "accessories").length,
        tools: inventory.filter((item) => item.category === "tools").length,
      },
    }

    res.json({ stats })
  } catch (error) {
    console.error("Inventar statistikasini olishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

module.exports = router
