import React, { useEffect, useState } from "react";
import "../AdminStyles/ReviewsList.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  deleteReviews,
  fetchAdminProducts,
  fetchProductReviews,
  removeErrors,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { removeSuccess } from "../features/products/productSlice";
import { useNavigate } from "react-router-dom";

const ReviewsList = () => {
  const { products, loading, error, reviews, success, message } = useSelector(
    (state) => state.admin,
  );
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  const handleViewReviews = (productId) => {
    setSelectedProduct(productId);
    dispatch(fetchProductReviews(productId));
  };

  const handleDeleteReview = (productId, reviewId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this review",
    );
    if (confirm) {
      dispatch(deleteReviews({ productId, reviewId }));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
    if (success) {
      toast.success(message);
      dispatch(removeSuccess());
      dispatch(clearMessage());
      navigate("/admin/products");
    }
  }, [dispatch, error, success, message, navigate]);

  if (!products || products.length === 0) {
    return (
      <div className="reviews-list-container">
        <h1 className="reviews-list-title">Admin Reviews</h1>
        <p>No Product Found</p>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <PageTitle title="All Reviews" />
          <div className="reviews-list-container">
            <h1 className="reviews-list-title">All Products</h1>
            <table className="reviews-table">
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Product Name</th>
                  <th>Product Image</th>
                  <th>Number of Reviews</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>
                      <img
                        src={product.image[0]?.url}
                        alt={product.name}
                        className="product-image"
                      />
                    </td>
                    <td>{product.numOfReview}</td>
                    <td>
                      {product.numOfReview > 0 && (
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleViewReviews(product._id)}
                        >
                          View Reviews
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedProduct && reviews && reviews.length > 0 && (
              <div className="reviews-details">
                <h2>Reviews for Product</h2>
                <table className="reviews-table">
                  <thead>
                    <tr>
                      <th>Sl No</th>
                      <th>Reviewer Name</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review, index) => (
                      <tr key={review._id}>
                        <td>{index + 1}</td>
                        <td>{review.name}</td>
                        <td>{review.rating}</td>
                        <td>{review.comment}</td>
                        <td>
                          <button
                            className="action-btn delete-btn"
                            onClick={() =>
                              handleDeleteReview(selectedProduct, review._id)
                            }
                          >
                            <Delete />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default ReviewsList;
