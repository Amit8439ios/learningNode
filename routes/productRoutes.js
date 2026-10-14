const express = require('express')
const jwt = require("jsonwebtoken")
const authMiddleware = require('../middleware/authMiddleware')
const Product = require('../models/Product')

const route = express.Router()

route.post("/", authMiddleware, async (req, res) => {
    try {
        const { productName, productType } = req.body

        console.log("====>>", req.body)

        if (!productName || !productType) {
            return res.status(400).json({
                success: false,
                message: "Product name and product type are required"
            })
        }

        const product = await Product.create({
            productName,
            productType,
            userId: req.user.userId
        })

        return res.status(200).json({
            success: true,
            message: "Prduct add successfully",
            data: product
        })

    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })

    }

})


route.get("/getProduct", authMiddleware, async (req, res) => {
    try {
        const products = await Product.find({
            userId: req.user.userId
        })

        return res.status(200).json({
            success: true,
            message: "product list",
            data: products
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
})


route.put("/updateProduct/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        const { productType } = req.body

        if (!productType) {
            return res.status(400).json({
                success: false,
                message: "product type is required"
            })
        }

        const product = await Product.findOneAndUpdate(
            {
                _id: id,
                userId: req.user.userId
            },
            {
                $set: { productType: productType }
            }
        )

        return res.status(200).json({
            success: true,
            message: "product type is updated",
            data: product
        })
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
})


route.delete("/deleteProduct/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params

        const product = await Product.findOneAndDelete({
            _id: id,
            userId: req.user.userId
        })

        if (!product) {
            return res.status(400).json({
                success: false,
                message: "product not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "product deleted",
            data: product
        })
    }
    catch (err) {

    }
})



module.exports = route