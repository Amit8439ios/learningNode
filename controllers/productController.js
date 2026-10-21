const productService = require('../services/productService')
const AppError = require('../utils/AppError')

const createProduct = async (req, res) => {
    const { productName, productType } = req.body

    if (!productName || !productType) {
        throw new AppError("Product name and product type are required", 400)
    }

    const product = await productService.createProduct(req.user.userId, {
        productName,
        productType
    })

    return res.status(201).json({
        success: true,
        message: "Prduct add successfully",
        data: product
    })
}

const getProducts = async (req, res) => {
    const { page, limit } = req.query
    const { products, pagination } = await productService.getProductsByUser(req.user.userId, page, limit)

    return res.status(200).json({
        success: true,
        message: "product list",
        data: products,
        pagination
    })
}

const updateProduct = async (req, res) => {
    const { productType } = req.body

    if (!productType) {
        throw new AppError("product type is required", 400)
    }

    const product = await productService.updateProductType(
        req.user.userId,
        req.params.id,
        productType
    )

    return res.status(200).json({
        success: true,
        message: "product type is updated",
        data: product
    })
}

const deleteProduct = async (req, res) => {
    const product = await productService.deleteProduct(req.user.userId, req.params.id)

    return res.status(200).json({
        success: true,
        message: "product deleted",
        data: product
    })
}

module.exports = { createProduct, getProducts, updateProduct, deleteProduct }
