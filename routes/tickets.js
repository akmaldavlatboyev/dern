const express = require("express")
const DataManager = require("../utils/dataManager")
const { verifyToken, requireAdmin, requireOwnershipOrAdmin } = require("../middleware/auth")

const router = express.Router()

// Get all tickets (admin) or user's tickets
router.get("/", verifyToken, (req, res) => {
  try {
    let tickets = DataManager.getTickets()

    // If not admin, filter by user ID
    if (!req.user.isAdmin) {
      tickets = tickets.filter((ticket) => ticket.userId === req.user.id)
    }

    // Apply filters
    const { status, priority, category, userId } = req.query

    if (status) {
      tickets = tickets.filter((ticket) => ticket.status === status)
    }

    if (priority) {
      tickets = tickets.filter((ticket) => ticket.priority === priority)
    }

    if (category) {
      tickets = tickets.filter((ticket) => ticket.category === category)
    }

    if (userId && req.user.isAdmin) {
      tickets = tickets.filter((ticket) => ticket.userId === Number.parseInt(userId))
    }

    // Sort by creation date (newest first)
    tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json({ tickets })
  } catch (error) {
    console.error("Ticketlarni olishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Get single ticket
router.get("/:id", verifyToken, (req, res) => {
  try {
    const ticket = DataManager.getTicketById(req.params.id)

    if (!ticket) {
      return res.status(404).json({ error: "Ticket topilmadi" })
    }

    // Check ownership or admin
    if (!req.user.isAdmin && ticket.userId !== req.user.id) {
      return res.status(403).json({ error: "Ruxsat berilmagan" })
    }

    res.json({ ticket })
  } catch (error) {
    console.error("Ticketni olishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Create new ticket
router.post("/", verifyToken, (req, res) => {
  try {
    const { title, description, category, priority, attachments } = req.body

    // Validation
    if (!title || !description || !category || !priority) {
      return res.status(400).json({ error: "Barcha majburiy maydonlar talab qilinadi" })
    }

    const tickets = DataManager.getTickets()
    const newTicket = {
      id: DataManager.generateId(),
      userId: req.user.id,
      title,
      description,
      category,
      priority,
      status: "pending",
      customerName: req.user.name,
      customerPhone: req.user.phone,
      customerType: req.user.accountType,
      attachments: attachments || [],
      solution: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    tickets.push(newTicket)
    DataManager.saveTickets(tickets)

    res.status(201).json({
      message: "Ticket muvaffaqiyatli yaratildi",
      ticket: newTicket,
    })
  } catch (error) {
    console.error("Ticket yaratishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Update ticket
router.put("/:id", verifyToken, (req, res) => {
  try {
    const tickets = DataManager.getTickets()
    const ticketIndex = tickets.findIndex((t) => t.id === Number.parseInt(req.params.id))

    if (ticketIndex === -1) {
      return res.status(404).json({ error: "Ticket topilmadi" })
    }

    const ticket = tickets[ticketIndex]

    // Check ownership or admin
    if (!req.user.isAdmin && ticket.userId !== req.user.id) {
      return res.status(403).json({ error: "Ruxsat berilmagan" })
    }

    // Update fields
    const allowedFields = req.user.isAdmin
      ? ["title", "description", "category", "priority", "status", "solution"]
      : ["title", "description", "category", "priority"]

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        ticket[field] = req.body[field]
      }
    })

    ticket.updatedAt = new Date().toISOString()

    tickets[ticketIndex] = ticket
    DataManager.saveTickets(tickets)

    res.json({
      message: "Ticket muvaffaqiyatli yangilandi",
      ticket,
    })
  } catch (error) {
    console.error("Ticketni yangilashda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Delete ticket (admin only)
router.delete("/:id", verifyToken, requireAdmin, (req, res) => {
  try {
    const tickets = DataManager.getTickets()
    const ticketIndex = tickets.findIndex((t) => t.id === Number.parseInt(req.params.id))

    if (ticketIndex === -1) {
      return res.status(404).json({ error: "Ticket topilmadi" })
    }

    tickets.splice(ticketIndex, 1)
    DataManager.saveTickets(tickets)

    res.json({ message: "Ticket muvaffaqiyatli o'chirildi" })
  } catch (error) {
    console.error("Ticketni o'chirishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Get ticket statistics
router.get("/stats/overview", verifyToken, (req, res) => {
  try {
    let tickets = DataManager.getTickets()

    // If not admin, filter by user ID
    if (!req.user.isAdmin) {
      tickets = tickets.filter((ticket) => ticket.userId === req.user.id)
    }

    const stats = {
      total: tickets.length,
      pending: tickets.filter((t) => t.status === "pending").length,
      inProgress: tickets.filter((t) => t.status === "in-progress").length,
      completed: tickets.filter((t) => t.status === "completed").length,
      cancelled: tickets.filter((t) => t.status === "cancelled").length,
      byPriority: {
        low: tickets.filter((t) => t.priority === "low").length,
        medium: tickets.filter((t) => t.priority === "medium").length,
        high: tickets.filter((t) => t.priority === "high").length,
        urgent: tickets.filter((t) => t.priority === "urgent").length,
      },
      byCategory: {
        hardware: tickets.filter((t) => t.category === "hardware").length,
        software: tickets.filter((t) => t.category === "software").length,
        network: tickets.filter((t) => t.category === "network").length,
        security: tickets.filter((t) => t.category === "security").length,
        other: tickets.filter((t) => t.category === "other").length,
      },
    }

    res.json({ stats })
  } catch (error) {
    console.error("Statistikani olishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

module.exports = router
