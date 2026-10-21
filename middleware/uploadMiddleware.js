const multer = require('multer')

// keep the file in memory; we only read its details and never save it
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
})

module.exports = upload
