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
const PORT = process.env.PORT || 3000


app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com"
        ],
        scriptSrcAttr: ["'self'", "'unsafe-inline'"],  // inline handlerlar uchun
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com"
        ],
        styleSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com"
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      }
    }
  })
);


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 100, // Har bir IP uchun maksimal 100 so‘rov
})
app.use(limiter)

// CORS sozlamasi
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
)

// JSON va URLencoded ma’lumotlar uchun parser
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Statik fayllar
app.use(express.static(path.join(__dirname, "public")))

// Boshlang‘ich ma’lumotlarni yuklash
initializeData()

// Marshrutlar
app.use("/api/auth", authRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/inventory", inventoryRoutes)
app.use("/api/knowledge-base", knowledgeBaseRoutes)
app.use("/api/users", userRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Frontend fayllar
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"))
})

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"))
})

// Xatoliklar uchun middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Serverda xatolik yuz berdi!",
    message: process.env.NODE_ENV === "development" ? err.message : "Ichki server xatosi",
  })
})

// 404 uchun
app.use("*", (req, res) => {
  res.status(404).json({ error: "Sahifa topilmadi" })
})

// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log(` Server ${PORT} portida ishlamoqda`)
  console.log(`Frontend: http://localhost:${PORT}`)
  console.log(` API: http://localhost:${PORT}`)
})

module.exports = app
