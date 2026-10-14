const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const productController = require('../controllers/productController')

const route = express.Router()

// every product route needs a logged-in user
route.use(authMiddleware)

route.post("/", productController.createProduct)
route.get("/getProduct", productController.getProducts)
route.put("/updateProduct/:id", productController.updateProduct)
route.delete("/deleteProduct/:id", productController.deleteProduct)

module.exports = route
