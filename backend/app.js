import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import product from "./routers/product.routers.js";
import user from "./routers/user.routers.js";
import order from "./routers/order.routers.js";
import payment from "./routers/paymentRoutes.js";
import errorMiddlerware from "./middleware/error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all for React Router
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

// Error Middleware
app.use(errorMiddlerware);

export default app;