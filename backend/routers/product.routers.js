import express from "express";
import {
  createProduct,
  createReviewAndUpdate,
  deleteProduct,
  deleteReview,
  getAdminProducts,
  getAllProducts,
  getProductReviews,
  getSingleProduct,
  updateProducts,
} from "../controller/product.controller.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";
const router = express.Router();

router.route("/products").get(getAllProducts);

router
  .route("/admin/product/create")
  .post(verifyUserAuth, roleBasedAccess("admin"), createProduct);

router
  .route("/admin/products")
  .get(verifyUserAuth, roleBasedAccess("admin"), getAdminProducts);

router
  .route("/admin/product/:id")
  .put(verifyUserAuth, roleBasedAccess("admin"), updateProducts)
  .delete(verifyUserAuth, roleBasedAccess("admin"), deleteProduct);

router.route("/product/:id").get(getSingleProduct);
router.route("/review").put(verifyUserAuth, createReviewAndUpdate);
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(verifyUserAuth, deleteReview);
export default router;
