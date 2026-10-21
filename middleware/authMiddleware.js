const jwt = require('jsonwebtoken')
const authService = require('../services/authService')

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Token is required"
            })
        }
        const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!(await authService.isTokenActive(token))) {
            return res.status(401).json({
                success: false,
                message: "Token has been logged out"
            })
        }

        req.user = decoded
        req.token = token

        next()
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
}

module.exports = authMiddleware
