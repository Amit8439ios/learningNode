const razorpay = require("./config/razorpay");

console.log("Razorpay instance initialized:", !!razorpay);
console.log("Razorpay Key ID loaded:", !!process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Key Secret loaded:", !!process.env.RAZORPAY_KEY_SECRET);