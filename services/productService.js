const Product = require('../models/Product')
const AppError = require('../utils/AppError')

const productCache = new Map()
const CacheTTL = 5 * 60 * 1000;

const createProduct = async (userId, { productName, productType }) => {
    CacheInvalidator(userId)
    return Product.create({ productName, productType, userId })
}

const getProductsByUser = async (userId, page = 1, limit = 2) => {
    page = Math.max(parseInt(page) || 1, 1)
    limit = Math.max(parseInt(limit) || 2, 1)

    const CacheKey = `${userId}:${page}:${limit}`

    const ctachData = productCache.get(CacheKey)

    if (ctachData && ctachData.expiry > Date.now()) {
        console.log("fetch from Cache")
        return ctachData.result
    }
    console.log("not found in Cache")

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
        Product.find({ userId }).sort({ _id: -1 }).skip(skip).limit(limit).lean(),
        Product.countDocuments({ userId })
    ])

    const result = {
        products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }

    productCache.set(CacheKey, { result, expiry: Date.now() + CacheTTL })
    return result
}

const CacheInvalidator = (userId) => {
    const prefix = `${userId}:`
    for (const key of productCache.keys()) {
        if (key.startsWith(prefix)) {
            productCache.delete(key)
        }
    }
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
