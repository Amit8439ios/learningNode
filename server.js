
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

const authRoute = require("./routes/authRoutes")
const productRoute = require("./routes/productRoutes")
const errorHandler = require("./middleware/errorHandler")
const userRoute = require("./routes/user_route")
const uploadRoute = require("./routes/uploadRoutes")
const paymentRoutes = require("./routes/payment_Route");
const fs = require("fs");
const stream = require("stream")

const app = express();


const writeFile = (req, res, next) => {
    fs.writeFile("abc.txt", "this is test text file", (err) => {
        if (err) return next(err);
        res.send("file created successfully");
    });
};

const readFile = (req, res, next) => {
    const fileStream = fs.createReadStream("/Users/amittoroi/Downloads/ABAIL(A)_7664_2024.pdf");


    fileStream.on("error", next);

    fileStream.on("open", () => {
        res.type("application/pdf");

        stream.pipeline(fileStream, res, (err) => {
            if (err) console.error("read-file stream error:", err.message);
        });
    });
}



const createJson = (req, res, next) => {
    const data = [{
        name: "Amit",
        age: "30"
    }]

    try {
        fs.writeFileSync("./data.json", JSON.stringify(data, null, 2))
        res.send("JSON file created")
    } catch (err) {
        next(err)
    }
}

const updateJson = (req, res, next) => {
    const newDate = {
        name: "Manish",
        age: 55
    }
    try {

        const currentData = JSON.parse(fs.readFileSync("./data.json", "utf-8"))
        currentData.push(newDate)

        fs.writeFileSync("./data.json", JSON.stringify(currentData, null, 2))
        res.json(currentData)
    } catch (err) {
        next(err)
    }
}


app.use(express.json());
app.use(express.static("Public"));

app.use("/api/auth", authRoute)
app.use("/api/route", productRoute)
app.use("/api/user", userRoute)
app.use("/api/upload", uploadRoute)
app.use("/api/payment", paymentRoutes)
app.use("/file/write-file", writeFile)
app.use("/file/read-file", readFile)
app.use("/file/json", createJson)
app.use("/file/updateJson", updateJson)

// must be registered after all routes
app.use(errorHandler)

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
    })
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => {
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Full error:", err);
    });

// Start server after MongoDB connects
mongoose.connection.asPromise().then(() => {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}).catch(err => {
    console.error("Unable to start server:", err.message);
});
