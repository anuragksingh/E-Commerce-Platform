import "../AdminStyles/Dashboard.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import {
  AddBox,
  AttachMoney,
  CheckCircle,
  Dashboard as DashboardIcon,
  Error,
  Instagram,
  Inventory,
  LinkedIn,
  People,
  ShoppingCart,
  Star,
  YouTube,
} from "@mui/icons-material";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchAdminProducts,
  fetchAllOrders,
} from "../features/admin/adminSlice";

const Dashboard = () => {
  const { products, orders, totalAmount } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const outOfStock = products.filter((products) => products.stock === 0).length;
  const inStock = products.filter((product) => product.stock > 0).length;
  const totalReviews = products.reduce(
    (acc, product) => acc + (product.reviews.length || 0),
    0,
  );
  return (
    <>
      <Navbar />
      <PageTitle title="Admin Dashboard" />
      <div className="admin-dashboard-container">
        <div className="admin-sidebar">
          <div className="admin-logo">
            <DashboardIcon className="admin-logo-icon" />
            Admin Dashboard
          </div>
          <nav className="admin-nav-menu">
            <div className="admin-nav-section">
              <h3>Products</h3>
              <Link to="/admin/products">
                <Inventory className="admin-nav-icon" />
                All Products
              </Link>
              <Link to="/admin/product/create">
                <AddBox className="admin-nav-icon" />
                Create Product
              </Link>
            </div>
            <div className="admin-nav-section">
              <h3>users</h3>
              <Link to="/admin/users">
                <People className="admin-nav-icon" />
                All Users
              </Link>
            </div>
            <div className="admin-nav-section">
              <h3>Orders</h3>
              <Link to="/admin/orders">
                <ShoppingCart className="admin-nav-icon" />
                All Orders
              </Link>
            </div>
            <div className="admin-nav-section">
              <h3>Reviews</h3>
              <Link to="/admin/reviews">
                <Star className="admin-nav-icon" />
                All Reviews
              </Link>
            </div>
          </nav>
        </div>

        <div className="admin-main-content">
          <div className="admin-stats-grid">
            <div className="admin-stat-box">
              <Inventory className="admin-icon" />
              <h3>Total Products</h3>
              <p>{totalProducts}</p>
            </div>

            <div className="admin-stat-box">
              <ShoppingCart className="admin-icon" />
              <h3>Total Order</h3>
              <p>{totalOrders}</p>
            </div>
            <div className="admin-stat-box">
              <Star className="admin-icon" />
              <h3>Total Reviews</h3>
              <p>{totalReviews}</p>
            </div>
            <div className="admin-stat-box">
              <AttachMoney className="admin-icon" />
              <h3>Total Revenue</h3>
              <p>{totalAmount}/-</p>
            </div>
            <div className="admin-stat-box">
              <Error className="admin-icon" />
              <h3>Out of Stock</h3>
              <p>{outOfStock}</p>
            </div>
            <div className="admin-stat-box">
              <CheckCircle className="admin-icon" />
              <h3>In Stock</h3>
              <p>{inStock}</p>
            </div>
          </div>

          <div className="admin-social-stats">
            <div className="admin-social-box instagram">
              <Instagram />
              <h3>Instagram</h3>
              <p>123K Followers</p>
              <p>12 posts</p>
            </div>
            <div className="admin-social-box linkedin">
              <LinkedIn />
              <h3>LinkedIn</h3>
              <p>23K Followers</p>
              <p>7 posts</p>
            </div>
            <div className="admin-social-box youtube">
              <YouTube />
              <h3>YouTube</h3>
              <p>13K Subscribers</p>
              <p>120 videoes</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
