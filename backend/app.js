import express from "express";
import product from "./routers/product.routers.js";
import errorMiddlerware from "./middleware/error.js";
const app = express();

// Middleware
app.use(express.json());

// route
app.use("/api/v1", product);
app.use(errorMiddlerware);

export default app;
