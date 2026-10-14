const joi = require('joi')

const userSchema = joi.object({
    firstName: joi.string()
        .trim()
        .min(3)
        .max(20)
        .required(),
    lastName: joi.string()
        .trim()
        .min(3)
        .max(20)
        .required(),
    email: joi.string()
        .trim()
        .lowercase()
        .email()
        .required(),
    password: joi.string()
        .min(8)
        .max(40)
        .required()
})

module.exports = { userSchema }
