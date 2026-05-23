import { Link, useNavigate } from "react-router-dom";
import "../CartStyles/Payment.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import CheckoutPath from "./CheckoutPath";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function Payment() {
  const orderItems = JSON.parse(sessionStorage.getItem("orderItem"));
  const { user } = useSelector((state) => state.user);
  const { shippingInfo } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const completePayment = async (amount) => {
    try {
      const { data: keyData } = await axios.get("/api/v1/getKey");
      const { key } = keyData;
      const { data: orderData } = await axios.post("/api/v1/payment/process", {
        amount,
      });
      const { order } = orderData;

      // Open Razorpay Checkout
      const options = {
        key,
        amount,
        currency: "INR",
        name: "ShopEasy",
        description: "Ecommerce Websit Payment Transaction",
        order_id: order.id,
        handler: async function (response) {
          const { data } = await axios.post("/api/v1/paymentVerification", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          console.log("BACKEND RESPONSE:", data);
          if (data.success) {
            navigate(`/paymentSuccess?reference=${data.reference}`);
          } else {
            alert("Payment verification Failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippingInfo.phoneNumber,
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <PageTitle title="Payment Processing" />
      <Navbar />
      <CheckoutPath activePath={2} />
      <div className="payment-container">
        <Link to="/order/confirm" className="payment-go-back">
          Go Back
        </Link>
        <button
          className="payment-btn"
          onClick={() => completePayment(orderItems.totalBill)}
        >
          Pay {orderItems.totalBill}
        </button>
      </div>
      <Footer />
    </>
  );
}
export default Payment;

// 06-05-2025 21:50:15
