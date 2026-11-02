require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

async function testIndex() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const indexes = await Product.collection.indexes({ productType: 1, productName: 1 });
        console.log("Current indexes:", indexes);

        const result = await Product.find({
            productName: "Football",
            productType: "Sports"
        }).explain("executionStats");

        console.log(
            JSON.stringify(result.executionStats, null, 2)
        );

        console.log(
            "Winning plan:",
            JSON.stringify(
                result.queryPlanner.winningPlan,
                null,
                2
            )
        );
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

testIndex();