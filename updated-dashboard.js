// Dashboard.js ni yangilangan versiyasi
const tickets = [] // Fayllarni saqlash uchun
const currentUser = {} // Joriy foydalanuvchi ma'lumotlari
const saveData = () => {} // Ma'lumotlarni saqlash uchun funksiya
const loadDashboardData = () => {} // Dashboard ma'lumotlarini yuklash uchun funksiya
const showSection = (section) => {} // Bo'limni ko'rsatish uchun funksiya
const handleFileUpload = (files) => {} // Fayllarni yuklash uchun funksiya
const displayFile = (fileId) => {} // Faylni ko'rsatish uchun funksiya
const formatDate = (date) => {} // Sanani formatlash uchun funksiya

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

function handleNewTicket(e) {
  e.preventDefault()

  const title = document.getElementById("ticketTitle").value
  const category = document.getElementById("ticketCategory").value
  const priority = document.getElementById("ticketPriority").value
  const description = document.getElementById("ticketDescription").value
  const attachments = document.getElementById("ticketAttachments").files

  // Fayllarni saqlash
  handleFileUpload(attachments).then((attachmentList) => {
    const newTicket = {
      id: generateId(),
      userId: currentUser.id,
      title,
      description,
      status: "pending",
      priority,
      category,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      customerType: currentUser.accountType,
      attachments: attachmentList, // Saqlangan fayllar
      solution: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    tickets.push(newTicket)
    saveData()

    document.getElementById("newTicketForm").reset()
    alert("Muammo muvaffaqiyatli yuborildi!")

    loadDashboardData()
    showSection("tickets")
  })
}

// Ticket ko'rish funksiyasini yangilash
function viewTicket(ticketId) {
  const ticket = tickets.find((t) => t.id === ticketId)
  if (!ticket) return

  let attachmentsHtml = ""
  if (ticket.attachments && ticket.attachments.length > 0) {
    attachmentsHtml = `
            <div class="ticket-attachments">
                <h4>Biriktirilgan fayllar:</h4>
                <div class="attachments-grid">
                    ${ticket.attachments
                      .map((attachment) => {
                        const fileId = attachment.url.replace("file-", "")
                        return `
                            <div class="attachment-item">
                                ${displayFile(fileId)}
                                <p>${attachment.name} (${(attachment.size / 1024 / 1024).toFixed(2)} MB)</p>
                            </div>
                        `
                      })
                      .join("")}
                </div>
            </div>
        `
  }

  const ticketDetails = document.getElementById("ticketDetails")
  ticketDetails.innerHTML = `
        <div class="ticket-info">
            <h3>Ticket #${ticket.id}: ${ticket.title}</h3>
            <div class="ticket-meta">
                <p><strong>Status:</strong> <span class="status-badge status-${ticket.status}">${ticket.status}</span></p>
                <p><strong>Muhimlik:</strong> <span class="priority-${ticket.priority}">${ticket.priority}</span></p>
                <p><strong>Kategoriya:</strong> ${ticket.category}</p>
                <p><strong>Yaratilgan:</strong> ${formatDate(ticket.createdAt)}</p>
                <p><strong>Yangilangan:</strong> ${formatDate(ticket.updatedAt)}</p>
            </div>
            
            <div class="ticket-description">
                <h4>Tavsif:</h4>
                <p>${ticket.description}</p>
            </div>
            
            ${attachmentsHtml}
            
            ${
              ticket.solution
                ? `
                <div class="ticket-solution">
                    <h4>Yechim:</h4>
                    <p>${ticket.solution}</p>
                </div>
            `
                : ""
            }
        </div>
    `

  document.getElementById("ticketModal").style.display = "block"
}
