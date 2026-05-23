import React, { useEffect } from "react";
import "../AdminStyles/ProductsList.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  fetchAdminProducts,
  removeErrors,
  removeSuccess,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const ProductsList = () => {
  const { products, loading, error, deleting } = useSelector(
    (state) => state.admin,
  );
  console.log(products);
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

  const handleDelete = (productId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product ?",
    );

    if (isConfirmed) {
      dispatch(deleteProduct(productId)).then((action) => {
        if (action.type === "admin/deleteProduct/fulfilled") {
          toast.success("Product Deleted Successfully");
          dispatch(removeSuccess());
        }
      });
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="product-list-container">
        <h1 className="product-list-title">Admin Products</h1>
        <p className="no-admin-products">No Products Found</p>
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
          <PageTitle title="All Products" />
          <div className="product-list-container">
            <h1 className="product-list-title">All Products</h1>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Ratings</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(products)
                  ? products.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>

                        <td>
                          <img
                            src={item.image?.[0]?.url}
                            alt={item.name}
                            className="admin-product-image"
                          />
                        </td>

                        <td>{item.name}</td>
                        <td>{item.price}/-</td>
                        <td>{item.rating}</td>
                        <td>{item.category}</td>
                        <td>{item.stock}</td>
                        <td>{new Date(item.createdAt).toLocaleString()}</td>

                        <td>
                          <Link
                            to={`/admin/product/${item._id}`}
                            className="action-icon edit-icon"
                          >
                            <Edit />
                          </Link>

                          <button
                            className="action-icon delete-icon"
                            disabled={deleting[item._id]}
                            onClick={() => handleDelete(item._id)}
                          >
                            {deleting[item._id] ? <Loader /> : <Delete />}
                          </button>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default ProductsList;
