import app from "./app.js";
import dotenv from "dotenv";
import { conectMongoDatabase } from "./config/db.js";

dotenv.config({ path: "./backend/config/config.env" });
conectMongoDatabase();
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
