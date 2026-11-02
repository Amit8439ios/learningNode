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
        },
        price:{
            type:Number,
            
        }
    },
    {
        timestamps: true
    }
)

// productSchema.index({ productType: 1, productName: 1 })
// productSchema.index({ productName: 1 })

module.exports = mongoose.model("Product", productSchema)