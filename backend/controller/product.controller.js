import Product from "../models/product.model.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";
import { v2 as cloudinary } from "cloudinary";

// Create Product
export const createProduct = handleAsyncError(async (req, res, next) => {
  let images = [];

  if (!req.files || !req.files.image) {
    return next(new ErrorHandler("No Images Uploaded", 400));
  }

  // single image
  if (!Array.isArray(req.files.image)) {
    images.push(req.files.image);
  } else {
    images = req.files.image;
  }

  const imageLinks = [];

  for (let i = 0; i < images.length; i++) {
    const base64Data = `data:${images[i].mimetype};base64,${images[i].data.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64Data, {
      folder: "products",
    });

    imageLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.image = imageLinks;

  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});
// Get All products
export const getAllProducts = handleAsyncError(async (req, res, next) => {
  const resultsPerPage = 8;
  const apiFeatures = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter();

  // Getting filtered query before pagination
  const filteredQuery = apiFeatures.query.clone();
  const productCount = await filteredQuery.countDocuments();

  // Calulate totalpages based on filtered count
  const totalPages = Math.ceil(productCount / resultsPerPage);
  const page = Number(req.query.page) || 1;

  if (page > totalPages && productCount > 0) {
    return next(new HandleError("This page doesn't exist", 404));
  }

  // Apply pagination
  apiFeatures.pagination(resultsPerPage);
  const product = await apiFeatures.query;

  if (!product || product.length === 0) {
    return next(new HandleError("No Product Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
    productCount,
    resultsPerPage,
    totalPages,
    currentPage: page,
  });
});

// Update product
export const updateProducts = handleAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new HandleError("Product Not Found", 404));
  }

  let images = [];

  if (typeof req.body.image === "string") {
    images.push(req.body.image);
  } else if (Array.isArray(req.body.image)) {
    images = req.body.image;
  }

  if (images.length > 0) {
    // Delete old images
    for (let i = 0; i < product.image.length; i++) {
      await cloudinary.uploader.destroy(product.image[i].public_id);
    }

    // Upload new images
    const imageLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products",
      });

      imageLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.image = imageLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product
export const deleteProduct = handleAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new HandleError("Product Not Found", 404));
  }

  for (let i = 0; i < product.image.length; i++) {
    await cloudinary.uploader.destroy(product.image[i].public_id);
  }

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

// Get Single Product
export const getSingleProduct = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new HandleError("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// Getting reviews
export const getProductReviews = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new HandleError("Product not found", 400));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Deleting Reviews
export const deleteReview = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new HandleError("Product not found", 400));
  }
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString(),
  );
  let sum = 0;
  reviews.forEach((review) => {
    sum += review.rating;
  });
  const rating = reviews.length > 0 ? sum / reviews.length : 0;
  const numOfReview = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      rating,
      numOfReview,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    success: true,
    message: "Review Deleted Successfully",
  });
});

// Creating and Updating Review
export const createReviewAndUpdate = handleAsyncError(
  async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
    const product = await Product.findById(productId);
    if (!product) {
      return next(new HandleError("Product not found", 400));
    }
    const reviewExists = product.reviews.find(
      (review) => review.user.toString() === req.user.id.toString(),
    );
    if (reviewExists) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user.id.toString()) {
          ((review.rating = rating), (review.comment = comment));
        }
      });
    } else {
      product.reviews.push(review);
    }
    product.numOfReview = product.reviews.length;
    let sum = 0;
    product.reviews.forEach((review) => {
      sum += review.rating;
    });
    product.rating =
      product.reviews.length > 0 ? sum / product.reviews.length : 0;
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      product,
    });
  },
);

// Admin get all product
export const getAdminProducts = handleAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});
