import { useEffect, useState } from "react";
import "../AdminStyles/UpdateOrder.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../features/order/orderSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import {
  removeErrors,
  removeSuccess,
  updateorderStatus,
} from "../features/admin/adminSlice";
const UpdateOrder = () => {
  const [statuss, setStatus] = useState("");
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order, loading: orderLoading } = useSelector((state) => state.order);
  const {
    success,
    loading: adminLoading,
    error,
  } = useSelector((state) => state.admin);

  const loading = adminLoading || orderLoading;

  const {
    paymentInfo = {},
    orderStatus,
    orderItems = [],
    shippingInfo = {},
  } = order;
  const paymentStatus =
    paymentInfo.status === "succeeded" ? "Paid" : "Not Paid";

  const finalOrderStatus =
    paymentStatus === "Not Paid" ? "Cancelled" : orderStatus;

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  const handleStatusUpdate = () => {
    if (!statuss) {
      toast.error("Please  select a status");
      return;
    }
    dispatch(updateorderStatus({ orderId, status: statuss }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
    if (success) {
      toast.success("Order status updated successfully");
      dispatch(removeSuccess());
      navigate("/admin/orders");
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, error, success, orderId, navigate]);
  return (
    <>
      <Navbar />
      <PageTitle title="Update Order" />
      {loading ? (
        <Loader />
      ) : (
        <div className="order-container">
          <h1 className="order-title">Update Order</h1>
          <div className="order-details">
            <h2>Order Information</h2>
            <p>
              <strong>Order ID :</strong> {order._id}
            </p>
            <p>
              <strong>Shipping Address :</strong> {shippingInfo.address},{" "}
              {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country}-
              {shippingInfo.pinCode}
            </p>
            <p>
              <strong>Phone :</strong> {shippingInfo.phoneNumber}
            </p>
            <p>
              <strong>Order Status :</strong> {finalOrderStatus}
            </p>
            <p>
              <strong>Payment Status :</strong>
              {paymentStatus}
            </p>
            <p>
              <strong>Total Price :</strong> {order.totalPrice}/-
            </p>
          </div>
          <div className="order-items">
            <h2>Order Items</h2>
            <table className="order-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <img
                        src={item?.image}
                        alt={item.productName}
                        className="order-item-image"
                      />
                    </td>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}/-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="order-status">
            <h2>Update Status</h2>
            <select
              className="status-select"
              value={statuss}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading || orderStatus === "Delivered"}
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="On The Way">On The Way</option>
              <option value="Delivered">Delivered</option>
            </select>
            <button
              className="update-button"
              onClick={handleStatusUpdate}
              disabled={loading || !statuss || orderStatus === "Delivered"}
            >
              Update Status
            </button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default UpdateOrder;
