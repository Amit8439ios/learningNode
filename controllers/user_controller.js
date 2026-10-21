const userService = require("../services/user_service");
const authService = require("../services/authService");
const { userSchema } = require("../validators/authValidator");
const { updateUserSchema } = require("../validators/userValidator");
const AppError = require("../utils/AppError");

const validate = (schema, body) => {
    const { error, value } = schema.validate(body, {
        abortEarly: false,
        convert: true
    });

    if (error) {
        throw new AppError(
            "Validation failed",
            400,
            error.details.map((detail) => detail.message)
        );
    }

    return value;
};

const requireId = (req) => {
    if (!req.params.id) {
        throw new AppError("user id is required in the url", 400);
    }
    return req.params.id;
};

// GET /api/user      -> all users with their products
// GET /api/user/:id  -> one user with their products
const getUsers = async (req, res) => {
    if (req.params.id) {
        const user = await userService.getUserWithProducts(req.params.id);
        return res.status(200).json({ success: true, method: req.method, data: user });
    }

    const users = await userService.getAllUsersWithProducts();
    return res.status(200).json({ success: true, method: req.method, data: users });
};

// POST /api/user
const createUser = async (req, res) => {
    const value = validate(userSchema, req.body);

    // reuse signup so the password gets hashed
    const user = await authService.signup(value);

    return res.status(201).json({
        success: true,
        method: req.method,
        message: "user created successfully",
        data: user
    });
};

// PUT /api/user/:id
const updateUser = async (req, res) => {
    const id = requireId(req);
    const value = validate(updateUserSchema, req.body);

    const user = await userService.updateUser(id, value);

    return res.status(200).json({
        success: true,
        method: req.method,
        message: "user updated successfully",
        data: user
    });
};

// DELETE /api/user/:id
const deleteUser = async (req, res) => {
    const id = requireId(req);

    await userService.deleteUser(id);

    return res.status(200).json({
        success: true,
        method: req.method,
        message: "user deleted successfully"
    });
};

const methodNotAllowed = (req, res) => {
    res.set("Allow", "GET, POST, PUT, DELETE");
    return res.status(405).json({
        success: false,
        method: req.method,
        message: `${req.method} method is not allowed`
    });
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    methodNotAllowed
};
