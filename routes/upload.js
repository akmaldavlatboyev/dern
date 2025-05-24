const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { verifyToken } = require("../middleware/auth")

const router = express.Router()

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|wmv/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Faqat rasm va video fayllar ruxsat etilgan!"))
    }
  },
})

// Upload single file
router.post("/single", verifyToken, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Fayl tanlanmagan" })
    }

    const fileInfo = {
      id: Date.now(),
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedBy: req.user.id,
      uploadedAt: new Date().toISOString(),
      url: `/api/upload/files/${req.file.filename}`,
    }

    res.json({
      message: "Fayl muvaffaqiyatli yuklandi",
      file: fileInfo,
    })
  } catch (error) {
    console.error("Fayl yuklashda xatolik:", error)
    res.status(500).json({ error: "Fayl yuklashda xatolik yuz berdi" })
  }
})

// Upload multiple files
router.post("/multiple", verifyToken, upload.array("files", 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Fayllar tanlanmagan" })
    }

    const filesInfo = req.files.map((file) => ({
      id: Date.now() + Math.random(),
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      uploadedBy: req.user.id,
      uploadedAt: new Date().toISOString(),
      url: `/api/upload/files/${file.filename}`,
    }))

    res.json({
      message: "Fayllar muvaffaqiyatli yuklandi",
      files: filesInfo,
    })
  } catch (error) {
    console.error("Fayllarni yuklashda xatolik:", error)
    res.status(500).json({ error: "Fayllarni yuklashda xatolik yuz berdi" })
  }
})

// Serve uploaded files
router.get("/files/:filename", (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(uploadsDir, filename)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Fayl topilmadi" })
    }

    res.sendFile(filePath)
  } catch (error) {
    console.error("Faylni yuborishda xatolik:", error)
    res.status(500).json({ error: "Faylni yuborishda xatolik yuz berdi" })
  }
})

// Delete uploaded file
router.delete("/files/:filename", verifyToken, (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(uploadsDir, filename)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Fayl topilmadi" })
    }

    fs.unlinkSync(filePath)
    res.json({ message: "Fayl muvaffaqiyatli o'chirildi" })
  } catch (error) {
    console.error("Faylni o'chirishda xatolik:", error)
    res.status(500).json({ error: "Faylni o'chirishda xatolik yuz berdi" })
  }
})

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "Fayl hajmi juda katta (maksimal 10MB)" })
    }
  }

  if (error.message === "Faqat rasm va video fayllar ruxsat etilgan!") {
    return res.status(400).json({ error: error.message })
  }

  res.status(500).json({ error: "Fayl yuklashda xatolik yuz berdi" })
})

module.exports = router
