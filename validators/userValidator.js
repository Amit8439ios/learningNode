const joi = require('joi')

// same rules as signup, but every field is optional; at least one is required
const updateUserSchema = joi.object({
    firstName: joi.string()
        .trim()
        .min(3)
        .max(20),
    lastName: joi.string()
        .trim()
        .min(3)
        .max(20),
    email: joi.string()
        .trim()
        .lowercase()
        .email()
}).min(1)

module.exports = { updateUserSchema }
