const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema(
    {
        tokenHash: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductUser",
            required: true
        },
        expiresAt: {
            type: Date,
            required: true,
            // MongoDB removes the document once the JWT has expired
            expires: 0
        }
    }
)

module.exports = mongoose.model("Token", tokenSchema)
