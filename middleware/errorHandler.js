const AppError = require('../utils/AppError')

// Central place that converts any thrown error into a JSON response.
// Express 5 forwards errors from async handlers here automatically.
const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.errors && { errors: err.errors })
        })
    }

    // Mongo duplicate key (e.g. unique email)
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "Duplicate value",
            errors: err.keyValue
        })
    }

    // Invalid ObjectId in params, schema validation failures
    if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }

    console.error(err)
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    })
}

module.exports = errorHandler
