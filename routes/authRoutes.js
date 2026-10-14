const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const authController = require('../controllers/authController')

const route = express.Router()

route.post("/signup", authController.signup)
route.post("/login", authController.login)
route.post("/logout", authMiddleware, authController.logout)

module.exports = route
