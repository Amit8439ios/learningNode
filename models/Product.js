const mongoose = require('mongoose')
const ProductUser = require('./ProductUser')

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true
        },
        productType: {
            type: String,
            required: true,
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: ProductUser,
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Product", productSchema)