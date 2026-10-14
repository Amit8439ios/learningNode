const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const ProductUser = require('../models/ProductUser')
const BlockedToken = require('../models/BlocklistedToken')
const AppError = require('../utils/AppError')

const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex")

const signup = async ({ firstName, lastName, email, password }) => {
    const mailexist = await ProductUser.findOne({ email })

    if (mailexist) {
        throw new AppError("user already exixt", 409)
    }

    const hashpassword = await bcrypt.hash(password, 12)

    const user = await ProductUser.create({
        firstName,
        lastName,
        email,
        password: hashpassword
    })

    // password has select:false but create() returns it; never send it back
    const userObj = user.toObject()
    delete userObj.password
    return userObj
}

const login = async ({ email, password }) => {
    const userExist = await ProductUser.findOne({
        email: email.toLowerCase().trim()
    }).select("+password")

    if (!userExist) {
        throw new AppError("invalid email or password", 400)
    }

    const isValidPassword = await bcrypt.compare(password, userExist.password)

    if (!isValidPassword) {
        throw new AppError("invalid email or password", 400)
    }

    const token = jwt.sign(
        { userId: userExist._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )

    return {
        token,
        user: {
            _id: userExist._id,
            name: userExist.firstName,
            email: userExist.email
        }
    }
}

const logout = async (token, decoded) => {
    await BlockedToken.create({
        hasToken: hashToken(token),
        expiresAt: new Date(decoded.exp * 1000)
    })
}

const isTokenBlacklisted = async (token) => {
    const found = await BlockedToken.findOne({ hasToken: hashToken(token) })
    return Boolean(found)
}

module.exports = { signup, login, logout, isTokenBlacklisted }
