import dotenv from "dotenv";
dotenv.config({ path: "./backend/config/config.env" });

import app from "./app.js";
import { conectMongoDatabase } from "./config/db.js";
import { v2 as cloudinary } from "cloudinary";
import Razorpay from "razorpay";

// Database Connection
conectMongoDatabase();

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "backend/config/config.env" });
}

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

// Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Server is shutting down due to uncaught exception");
  process.exit(1);
});

// Server
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`Server is Running on PORT ${port}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Server is shutting down due to unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});
