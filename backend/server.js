import dotenv from "dotenv";
dotenv.config({ path: "./backend/config/config.env" });

import app from "./app.js";
import { conectMongoDatabase } from "./config/db.js";
import { v2 as cloudinary } from "cloudinary";
import Razorpay from "razorpay";

// Disable Logs in production
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.warn = () => {};
}

// Database Connection
conectMongoDatabase();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Razorpay Instance
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// Uncaught Exception — LOG before exiting!
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.message);
  process.exit(1);
});

// Server
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.error(`Server running on port ${port}`); // use error so it shows even in production
});

// Unhandled Promise Rejection — LOG before exiting!
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err.message);
  server.close(() => {
    process.exit(1);
  });
});