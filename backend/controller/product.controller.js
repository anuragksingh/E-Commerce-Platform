import Product from "../models/product.model.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";

// creating product
export const createProduct = handleAsyncError(async (req, res, next) => {
  const productModel = await Product.create(req.body);
  res.status(201).json({
    success: true,
  });
});

// Get All products
export const getAllProducts = handleAsyncError(async (req, res, next) => {
  const resultsPerPage = 3;
  const apiFunctionality = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultsPerPage);

  const products = await apiFunctionality.query;
  res.status(200).json({
    success: true,
    products,
  });
});

// Update product
export const updateProducts = handleAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new HandleError("Product Not Found", 500));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product
export const deleteProduct = handleAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new HandleError("Product Not Found", 500));
  }

  res.status(204).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

// Get Single Product
export const getSinglProduct = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new HandleError("Product Not Found", 500));
  }
  res.status(200).json({
    success: true,
    product,
  });
});
