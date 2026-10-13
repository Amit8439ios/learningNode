const mongoose = require('mongoose');

const userShema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },

    },
    {
        timestemps: true
    }
)

module.exports = mongoose.model("User", userShema)