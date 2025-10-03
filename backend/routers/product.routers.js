import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSinglProduct,
  updateProducts,
} from "../controller/product.controller.js";
const router = express.Router();

router.route("/products").get(getAllProducts).post(createProduct);
router
  .route("/product/:id")
  .put(updateProducts)
  .delete(deleteProduct)
  .get(getSinglProduct);
export default router;
