
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const authRoute = require("./routes/authRoutes")

const app = express();


app.use(express.json());

app.use("/api/auth", authRoute)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection failed:", err.message));

// GET: All users
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find();

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// POST: Create user
app.post("/api/addUser", async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        const newUser = await User.create({ name, email });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
        });
    } catch (err) {
        return res.status(err.code === 11000 ? 409 : 400).json({
            success: false,
            message: err.message
        });
    }
});

// GET: Single user by MongoDB ID
app.get("/api/getUser/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// PUT: Update user
app.put("/api/updateUser/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (err) {
        return res.status(err.code === 11000 ? 409 : 400).json({
            success: false,
            message: err.message
        });
    }
});

// DELETE: Delete user
app.delete("/api/deleteUser/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: user
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// Start server after MongoDB connects
mongoose.connection.asPromise().then(() => {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}).catch(err => {
    console.error("Unable to start server:", err.message);
});
