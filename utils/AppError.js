// An error that carries an HTTP status code.
// Services throw it; the error handler turns it into a response.
class AppError extends Error {
    constructor(message, statusCode = 500, errors) {
        super(message)
        this.statusCode = statusCode
        this.errors = errors
    }
}

module.exports = AppError
