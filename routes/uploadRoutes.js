const express = require('express')
const upload = require('../middleware/uploadMiddleware')
const uploadController = require('../controllers/uploadController')

const route = express.Router()

route.post("/", upload.single("file"), uploadController.uploadFile)

module.exports = route
