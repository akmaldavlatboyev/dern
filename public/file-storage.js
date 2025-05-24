// Fayllarni Base64 formatida saqlash
function handleFileUpload(files) {
  const attachmentList = []
  const promises = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    // Fayl hajmini tekshirish (5MB gacha)
    if (file.size > 5 * 1024 * 1024) {
      alert(`Fayl "${file.name}" juda katta. 5MB dan kichik fayl tanlang.`)
      continue
    }

    const promise = new Promise((resolve) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const fileData = {
          id: generateId(),
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result, // Base64 ma'lumot
          uploadDate: new Date().toISOString(),
        }

        // Faylni localStorage ga saqlash
        saveFileToStorage(fileData)

        attachmentList.push({
          id: fileData.id,
          name: file.name,
          type: file.type,
          size: file.size,
          url: `file-${fileData.id}`, // Fayl ID si
        })

        resolve()
      }

      reader.readAsDataURL(file) // Base64 ga o'girish
    })

    promises.push(promise)
  }

  return Promise.all(promises).then(() => attachmentList)
}

// Faylni localStorage ga saqlash
function saveFileToStorage(fileData) {
  const savedFiles = JSON.parse(localStorage.getItem("dern_files") || "[]")
  savedFiles.push(fileData)
  localStorage.setItem("dern_files", JSON.stringify(savedFiles))
}

// Faylni localStorage dan olish
function getFileFromStorage(fileId) {
  const savedFiles = JSON.parse(localStorage.getItem("dern_files") || "[]")
  return savedFiles.find((file) => file.id === fileId)
}

// Faylni ko'rsatish
function displayFile(fileId) {
  const fileData = getFileFromStorage(fileId)
  if (!fileData) return null

  if (fileData.type.startsWith("image/")) {
    return `<img src="${fileData.data}" alt="${fileData.name}" style="max-width: 300px; max-height: 200px;">`
  } else if (fileData.type.startsWith("video/")) {
    return `<video controls style="max-width: 300px; max-height: 200px;">
                    <source src="${fileData.data}" type="${fileData.type}">
                    Brauzeringiz video ni qo'llab-quvvatlamaydi.
                </video>`
  }

  return `<a href="${fileData.data}" download="${fileData.name}">${fileData.name}</a>`
}

// generateId function declaration
function generateId() {
  return Math.random().toString(36).substr(2, 9)
}
