import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProducts,
} from "../controller/product.controller.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";
const router = express.Router();

router
  .route("/products")
  .get(verifyUserAuth, getAllProducts)
  .post(verifyUserAuth, roleBasedAccess("admin"), createProduct);
router
  .route("/product/:id")
  .put(verifyUserAuth,roleBasedAccess("admin"), updateProducts)
  .delete(verifyUserAuth,roleBasedAccess("admin"), deleteProduct)
  .get(verifyUserAuth, getSingleProduct);
export default router;
