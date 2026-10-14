
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const authRoute = require("./routes/authRoutes")
const productRoute = require("./routes/productRoutes")

const app = express();


app.use(express.json());

app.use("/api/auth", authRoute)
app.use("/api/route", productRoute)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection failed:", err.message));


// Start server after MongoDB connects
mongoose.connection.asPromise().then(() => {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}).catch(err => {
    console.error("Unable to start server:", err.message);
});
