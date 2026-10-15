const Product = require('../models/Product')
const AppError = require('../utils/AppError')

const productCache = new Map()
const CacheTTL = 5 * 60 * 1000;

const createProduct = async (userId, { productName, productType }) => {
    CacheInvalidator(userId)
    return Product.create({ productName, productType, userId })
}

const getProductsByUser = async (userId) => {
    const CacheKey = String(userId)

    const ctachData = productCache.get(CacheKey)

    if (ctachData && ctachData.expiry > Date.now()) {
        console.log("fetch from Cache")
        return ctachData.products
    }
    console.log("not found in Cache")

    const product = await Product.find({ userId }).lean();

    productCache.set(CacheKey, { products: product, expiry: Date.now() + CacheTTL })
    return product
}

const CacheInvalidator = (userId) => {
    productCache.delete(String(userId))
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

    CacheInvalidator(userId)

    return product
}

const deleteProduct = async (userId, productId) => {
    const product = await Product.findOneAndDelete({ _id: productId, userId })

    if (!product) {
        throw new AppError("product not found", 404)
    }

    CacheInvalidator(userId)
    return product
}

module.exports = { createProduct, getProductsByUser, CacheInvalidator, updateProductType, deleteProduct }
