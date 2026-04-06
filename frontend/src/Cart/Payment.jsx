import { Link } from "react-router-dom";
import "../CartStyles/Payment.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import CheckoutPath from "./CheckoutPath";

function Payment() {
  const orderItems = JSON.parse(sessionStorage.getItem("orderItem"));
  return (
    <>
      <PageTitle title="Payment Processing" />
      <Navbar />
      <CheckoutPath activePath={2} />
      <div className="payment-container">
        <Link to="/order/confirm" className="payment-go-back">
          Go Back
        </Link>
        <button className="payment-btn">Pay {orderItems.totalBill}</button>
      </div>
      <Footer />
    </>
  );
}
export default Payment;
