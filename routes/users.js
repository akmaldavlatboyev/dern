const express = require("express")
const bcrypt = require("bcryptjs")
const DataManager = require("../utils/dataManager")
const { verifyToken, requireAdmin } = require("../middleware/auth")

const router = express.Router()

// Get all users (admin only)
router.get("/", verifyToken, requireAdmin, (req, res) => {
  try {
    const users = DataManager.getUsers()

    // Remove passwords from response
    const safeUsers = users.map((user) => {
      const { password, ...safeUser } = user
      return safeUser
    })

    // Apply filters
    const { accountType, isAdmin } = req.query
    let filteredUsers = safeUsers

    if (accountType) {
      filteredUsers = filteredUsers.filter((user) => user.accountType === accountType)
    }

    if (isAdmin !== undefined) {
      filteredUsers = filteredUsers.filter((user) => user.isAdmin === (isAdmin === "true"))
    }

    // Sort by creation date (newest first)
    filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json({ users: filteredUsers })
  } catch (error) {
    console.error("Foydalanuvchilarni olishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Get single user
router.get("/:id", verifyToken, (req, res) => {
  try {
    const user = DataManager.getUserById(req.params.id)

    if (!user) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi" })
    }

    // Check if user can access this profile
    if (!req.user.isAdmin && req.user.id !== Number.parseInt(req.params.id)) {
      return res.status(403).json({ error: "Ruxsat berilmagan" })
    }

    // Remove password from response
    const { password, ...safeUser } = user

    res.json({ user: safeUser })
  } catch (error) {
    console.error("Foydalanuvchini olishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Update user profile
router.put("/:id", verifyToken, (req, res) => {
  try {
    const users = DataManager.getUsers()
    const userIndex = users.findIndex((u) => u.id === Number.parseInt(req.params.id))

    if (userIndex === -1) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi" })
    }

    // Check if user can update this profile
    if (!req.user.isAdmin && req.user.id !== Number.parseInt(req.params.id)) {
      return res.status(403).json({ error: "Ruxsat berilmagan" })
    }

    const { name, phone, email, accountType } = req.body
    const user = users[userIndex]

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = DataManager.getUserByEmail(email)
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ error: "Bu email allaqachon ishlatilmoqda" })
      }
    }

    // Update allowed fields
    if (name !== undefined) user.name = name
    if (phone !== undefined) user.phone = phone
    if (email !== undefined) user.email = email
    if (accountType !== undefined && req.user.isAdmin) user.accountType = accountType

    user.updatedAt = new Date().toISOString()

    users[userIndex] = user
    DataManager.saveUsers(users)

    // Remove password from response
    const { password, ...safeUser } = user

    res.json({
      message: "Profil muvaffaqiyatli yangilandi",
      user: safeUser,
    })
  } catch (error) {
    console.error("Profilni yangilashda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Change password
router.put("/:id/password", verifyToken, async (req, res) => {
  try {
    const users = DataManager.getUsers()
    const userIndex = users.findIndex((u) => u.id === Number.parseInt(req.params.id))

    if (userIndex === -1) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi" })
    }

    // Check if user can change this password
    if (!req.user.isAdmin && req.user.id !== Number.parseInt(req.params.id)) {
      return res.status(403).json({ error: "Ruxsat berilmagan" })
    }

    const { currentPassword, newPassword } = req.body

    // Validation
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak" })
    }

    const user = users[userIndex]

    // If not admin, verify current password
    if (!req.user.isAdmin) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Joriy parol talab qilinadi" })
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password)
      if (!isValidPassword) {
        return res.status(400).json({ error: "Joriy parol noto'g'ri" })
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    user.updatedAt = new Date().toISOString()

    users[userIndex] = user
    DataManager.saveUsers(users)

    res.json({ message: "Parol muvaffaqiyatli o'zgartirildi" })
  } catch (error) {
    console.error("Parolni o'zgartirishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Delete user (admin only)
router.delete("/:id", verifyToken, requireAdmin, (req, res) => {
  try {
    const users = DataManager.getUsers()
    const userIndex = users.findIndex((u) => u.id === Number.parseInt(req.params.id))

    if (userIndex === -1) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi" })
    }

    const user = users[userIndex]

    // Prevent deleting admin users
    if (user.isAdmin) {
      return res.status(400).json({ error: "Admin foydalanuvchini o'chirib bo'lmaydi" })
    }

    // Delete user's tickets as well
    const tickets = DataManager.getTickets()
    const updatedTickets = tickets.filter((ticket) => ticket.userId !== user.id)
    DataManager.saveTickets(updatedTickets)

    // Delete user
    users.splice(userIndex, 1)
    DataManager.saveUsers(users)

    res.json({ message: "Foydalanuvchi va uning barcha ma'lumotlari muvaffaqiyatli o'chirildi" })
  } catch (error) {
    console.error("Foydalanuvchini o'chirishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Get user statistics
router.get("/stats/overview", verifyToken, requireAdmin, (req, res) => {
  try {
    const users = DataManager.getUsers()
    const tickets = DataManager.getTickets()

    const stats = {
      totalUsers: users.filter((user) => !user.isAdmin).length,
      adminUsers: users.filter((user) => user.isAdmin).length,
      personalAccounts: users.filter((user) => user.accountType === "personal").length,
      businessAccounts: users.filter((user) => user.accountType === "business").length,
      newUsersThisMonth: users.filter((user) => {
        const userDate = new Date(user.createdAt)
        const now = new Date()
        return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear()
      }).length,
      activeUsers: users.filter((user) => {
        const userTickets = tickets.filter((ticket) => ticket.userId === user.id)
        return userTickets.length > 0
      }).length,
    }

    res.json({ stats })
  } catch (error) {
    console.error("Foydalanuvchi statistikasini olishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

module.exports = router
