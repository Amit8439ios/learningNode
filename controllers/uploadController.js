const AppError = require('../utils/AppError')

const uploadFile = async (req, res) => {
    if (!req.file) {
        throw new AppError("file is required (form-data field name: file)", 400)
    }

    const { originalname, mimetype, size } = req.file

    return res.status(200).json({
        success: true,
        data: {
            fileName: originalname,
            fileType: mimetype,
            fileSize: size
        }
    })
}

module.exports = { uploadFile }
