import dotenv from "dotenv";
dotenv.config({ path: "./backend/config/config.env" });
import app from "./app.js";
import { conectMongoDatabase } from "./config/db.js";
import {v2 as cloudinary} from 'cloudinary';

conectMongoDatabase();
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET
})

const port = process.env.PORT || 3000;

process.on("uncaughtException", (err) => {
  console.log(`Error ${err.message}`);
  console.log(`
    Server is shutting down, due to uncaught exception errors`);
  process.exit(1);
});

const server = app.listen(port, () => {
  console.log(`Server is Running on PORT ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server is shutting down , due to unhandled promies rejection`);
  server.close(() => {
    process.exit(1);
  });
});
