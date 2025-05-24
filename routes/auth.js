const express = require("express")
const bcrypt = require("bcryptjs")
const DataManager = require("../utils/dataManager")
const { generateToken, verifyToken } = require("../middleware/auth")

const router = express.Router()

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, accountType } = req.body

    // Validation
    if (!name || !email || !phone || !password || !accountType) {
      return res.status(400).json({ error: "Barcha maydonlar talab qilinadi" })
    }

    // Check if user exists
    const existingUser = DataManager.getUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ error: "Bu email bilan foydalanuvchi allaqachon mavjud" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const users = DataManager.getUsers()
    const newUser = {
      id: DataManager.generateId(),
      name,
      email,
      phone,
      password: hashedPassword,
      accountType,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    DataManager.saveUsers(users)

    // Generate token
    const token = generateToken(newUser)

    // Remove password from response
    const { password: _, ...userResponse } = newUser

    res.status(201).json({
      message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi",
      user: userResponse,
      token,
    })
  } catch (error) {
    console.error("Ro'yxatdan o'tishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email va parol talab qilinadi" })
    }

    // Find user
    const user = DataManager.getUserByEmail(email)
    if (!user) {
      return res.status(401).json({ error: "Noto'g'ri email yoki parol" })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Noto'g'ri email yoki parol" })
    }

    // Check admin access
    if (isAdmin && !user.isAdmin) {
      return res.status(403).json({ error: "Admin huquqlari yo'q" })
    }

    // Generate token
    const token = generateToken(user)

    // Remove password from response
    const { password: _, ...userResponse } = user

    res.json({
      message: "Muvaffaqiyatli kirildi",
      user: userResponse,
      token,
    })
  } catch (error) {
    console.error("Kirishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Get current user
router.get("/me", verifyToken, (req, res) => {
  const { password, ...userResponse } = req.user
  res.json({ user: userResponse })
})

// Logout (client-side token removal)
router.post("/logout", verifyToken, (req, res) => {
  res.json({ message: "Muvaffaqiyatli chiqildi" })
})

module.exports = router
