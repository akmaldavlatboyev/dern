const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const path = require("path")
require("dotenv").config()

// Import routes
const authRoutes = require("./routes/auth")
const ticketRoutes = require("./routes/tickets")
const uploadRoutes = require("./routes/upload")
const inventoryRoutes = require("./routes/inventory")
const knowledgeBaseRoutes = require("./routes/knowledgeBase")
const userRoutes = require("./routes/users")

// Import utilities
const { initializeData } = require("./utils/initData")

const app = express()
const PORT = process.env.PORT || 3002

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3002",
    credentials: true,
  }),
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Static files
app.use(express.static(path.join(__dirname, "public")))

// Initialize data
initializeData()

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/inventory", inventoryRoutes)
app.use("/api/knowledge-base", knowledgeBaseRoutes)
app.use("/api/users", userRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Serve frontend files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"))
})

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Serverda xatolik yuz berdi!",
    message: process.env.NODE_ENV === "development" ? err.message : "Ichki server xatosi",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Sahifa topilmadi" })
})

app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portida ishlamoqda`)
  console.log(`📱 Frontend: http://localhost:${PORT}`)
  console.log(`🔧 API: http://localhost:${PORT}/api`)
})

module.exports = app
