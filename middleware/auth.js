const jwt = require("jsonwebtoken")
const DataManager = require("../utils/dataManager")

const JWT_SECRET = process.env.JWT_SECRET || "dern-support-secret-key-2024"

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    JWT_SECRET,
    { expiresIn: "24h" },
  )
}

// Verify JWT token
function verifyToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return res.status(401).json({ error: "Token talab qilinadi" })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = DataManager.getUserById(decoded.id)

    if (!user) {
      return res.status(401).json({ error: "Foydalanuvchi topilmadi" })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: "Noto'g'ri token" })
  }
}

// Admin only middleware
function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Admin huquqlari talab qilinadi" })
  }
  next()
}

// Check if user owns resource or is admin
function requireOwnershipOrAdmin(req, res, next) {
  const resourceUserId = Number.parseInt(req.params.userId || req.body.userId)

  if (req.user.isAdmin || req.user.id === resourceUserId) {
    next()
  } else {
    res.status(403).json({ error: "Ruxsat berilmagan" })
  }
}

module.exports = {
  generateToken,
  verifyToken,
  requireAdmin,
  requireOwnershipOrAdmin,
}
