import express from "express";
import cookieParser from "cookie-parser";
import product from "./routers/product.routers.js";
import user from "./routers/user.routers.js";
import errorMiddlerware from "./middleware/error.js";
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());


// route
app.use("/api/v1", product);
app.use("/api/v1", user);

app.use(errorMiddlerware);

export default app;
