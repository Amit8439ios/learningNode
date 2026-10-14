const Product = require('../models/Product')
const AppError = require('../utils/AppError')

const createProduct = async (userId, { productName, productType }) => {
    return Product.create({ productName, productType, userId })
}

const getProductsByUser = async (userId) => {
    return Product.find({ userId })
}

const updateProductType = async (userId, productId, productType) => {
    const product = await Product.findOneAndUpdate(
        { _id: productId, userId },
        { $set: { productType } },
        { returnDocument: "after" }
    )

    if (!product) {
        throw new AppError("product not found", 404)
    }

    return product
}

const deleteProduct = async (userId, productId) => {
    const product = await Product.findOneAndDelete({ _id: productId, userId })

    if (!product) {
        throw new AppError("product not found", 404)
    }

    return product
}

module.exports = { createProduct, getProductsByUser, updateProductType, deleteProduct }
