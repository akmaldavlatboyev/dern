const express = require("express")
const DataManager = require("../utils/dataManager")
const { verifyToken, requireAdmin } = require("../middleware/auth")

const router = express.Router()

// Get all knowledge base articles
router.get("/", (req, res) => {
  try {
    let articles = DataManager.getKnowledgeBase()

    // Apply filters
    const { category, search } = req.query

    if (category) {
      articles = articles.filter((article) => article.category === category)
    }

    if (search) {
      articles = DataManager.searchKnowledgeBase(search)
    }

    // Sort by views (most popular first)
    articles.sort((a, b) => b.views - a.views)

    res.json({ articles })
  } catch (error) {
    console.error("Bilimlar bazasini olishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Get single article
router.get("/:id", (req, res) => {
  try {
    const articles = DataManager.getKnowledgeBase()
    const article = articles.find((a) => a.id === Number.parseInt(req.params.id))

    if (!article) {
      return res.status(404).json({ error: "Maqola topilmadi" })
    }

    // Increment view count
    article.views += 1
    DataManager.saveKnowledgeBase(articles)

    res.json({ article })
  } catch (error) {
    console.error("Maqolani olishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Create new article (admin only)
router.post("/", verifyToken, requireAdmin, (req, res) => {
  try {
    const { title, category, content, tags } = req.body

    // Validation
    if (!title || !category || !content) {
      return res.status(400).json({ error: "Sarlavha, kategoriya va kontent talab qilinadi" })
    }

    const articles = DataManager.getKnowledgeBase()
    const newArticle = {
      id: DataManager.generateId(),
      title,
      category,
      content,
      tags: tags || [],
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: req.user.name,
    }

    articles.push(newArticle)
    DataManager.saveKnowledgeBase(articles)

    res.status(201).json({
      message: "Maqola muvaffaqiyatli yaratildi",
      article: newArticle,
    })
  } catch (error) {
    console.error("Maqola yaratishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Update article (admin only)
router.put("/:id", verifyToken, requireAdmin, (req, res) => {
  try {
    const articles = DataManager.getKnowledgeBase()
    const articleIndex = articles.findIndex((a) => a.id === Number.parseInt(req.params.id))

    if (articleIndex === -1) {
      return res.status(404).json({ error: "Maqola topilmadi" })
    }

    const { title, category, content, tags } = req.body
    const article = articles[articleIndex]

    // Update fields
    if (title !== undefined) article.title = title
    if (category !== undefined) article.category = category
    if (content !== undefined) article.content = content
    if (tags !== undefined) article.tags = tags
    article.updatedAt = new Date().toISOString()

    articles[articleIndex] = article
    DataManager.saveKnowledgeBase(articles)

    res.json({
      message: "Maqola muvaffaqiyatli yangilandi",
      article,
    })
  } catch (error) {
    console.error("Maqolani yangilashda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Delete article (admin only)
router.delete("/:id", verifyToken, requireAdmin, (req, res) => {
  try {
    const articles = DataManager.getKnowledgeBase()
    const articleIndex = articles.findIndex((a) => a.id === Number.parseInt(req.params.id))

    if (articleIndex === -1) {
      return res.status(404).json({ error: "Maqola topilmadi" })
    }

    articles.splice(articleIndex, 1)
    DataManager.saveKnowledgeBase(articles)

    res.json({ message: "Maqola muvaffaqiyatli o'chirildi" })
  } catch (error) {
    console.error("Maqolani o'chirishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Search articles
router.get("/search/:query", (req, res) => {
  try {
    const query = req.params.query
    const articles = DataManager.searchKnowledgeBase(query)

    res.json({ articles, query })
  } catch (error) {
    console.error("Qidirishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

// Get popular articles
router.get("/popular/top", (req, res) => {
  try {
    const articles = DataManager.getKnowledgeBase()
    const limit = Number.parseInt(req.query.limit) || 5

    const popularArticles = articles.sort((a, b) => b.views - a.views).slice(0, limit)

    res.json({ articles: popularArticles })
  } catch (error) {
    console.error("Mashhur maqolalarni olishda xatolik:", error)
    res.status(500).json({ error: "Server xatosi" })
  }
})

module.exports = router
