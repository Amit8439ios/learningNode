const authService = require('../services/authService')
const { userSchema } = require('../validators/authValidator')
const AppError = require('../utils/AppError')

const signup = async (req, res) => {
    const { error, value } = userSchema.validate(req.body, {
        abortEarly: false,
        convert: true
    })

    if (error) {
        throw new AppError(
            "Validation failed",
            400,
            error.details.map((detail) => detail.message)
        )
    }

    // value is already trimmed and lowercased by Joi
    const user = await authService.signup(value)

    return res.status(201).json({
        success: true,
        data: user
    })
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new AppError("email and password are required", 400)
    }

    const { token, user } = await authService.login({ email, password })

    return res.status(200).json({
        success: true,
        message: "login successfully",
        token,
        data: user
    })
}

const logout = async (req, res) => {
    await authService.logout(req.token)

    return res.status(200).json({
        success: true,
        message: "Logout successful"
    })
}

module.exports = { signup, login, logout }
