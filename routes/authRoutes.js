const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const crypto = require('crypto')
// const productUser = require('../models/ProductUser')
const ProductUser = require('../models/ProductUser')
const authMiddleware = require('../middleware/authMiddleware')
const BlockedToken = require('../models/BlocklistedToken')

const route = express.Router()


route.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const mailexist = await ProductUser.findOne({
            email: email.toLowerCase().trim()
        })

        if (mailexist) {
            return res.status(409).json({
                success: false,
                message: "user already exixt"
            })
        }

        const hashpassword = await bcrypt.hash(password, 12)

        const user = await ProductUser.create({
            firstName,
            lastName,
            email: email.toLowerCase().trim(),
            password: hashpassword
        })

        return res.status(200).json({
            success: true,
            data: user
        })
    }
    catch (err) {
        if (err) {
            return res.status(409).json({
                success: false,
                message: err.message
            })
        }
    }
})


route.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password are required"
            })
        }

        const userExist = await ProductUser.findOne({
            email: email.toLowerCase().trim()
        }).select("+password")

        if (!userExist) {
            res.status(400).json({
                success: false,
                message: "invalid user"
            })
        }

        const isValidPassword = await bcrypt.compare(
            password,
            userExist.password
        )

        if (!isValidPassword) {
            res.status(400).json({
                success: false,
                message: "invalid email or password"
            })
        }

        const token = jwt.sign(
            { userId: userExist._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        return res.status(200).json({
            success: true,
            message: "login successfully",
            token: token,
            data: {
                _id: userExist._id,
                name: userExist.firstName,
                email: userExist.email,
            }

        })

    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })

    }
})


route.post("/logout", authMiddleware, async (req, res) => {
    try {
        const hasToken = crypto.createHash("sha256").update(req.token).digest("hex")

        const decoded = req.user;

        await BlockedToken.create({
            hasToken,
            expiresAt: new Date(decoded.exp * 1000)
        })

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Logout failed",
            error: err.message
        });
    }
})


module.exports = route