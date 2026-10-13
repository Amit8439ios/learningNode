const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const BlacklistedToken = require("../models/BlocklistedToken");


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

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

         const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const blacklistedToken = await BlacklistedToken.findOne({
            tokenHash
        });

        req.user = decoded;
        req.token = token;

        next()
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}


module.exports = authMiddleware