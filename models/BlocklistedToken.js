const mongoose = require('mongoose')

const BlocklistedTokenSchema = new mongoose.Schema(
    {
        hasToken: {
            type: String,
            required: true,
            unique: true
        },
        expiresAt: {
            type: Date,
            required: true
        }
    }
)

module.exports = mongoose.model("BlockedToken", BlocklistedTokenSchema)