import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  forgotPassword,
  removeErrors,
  removeSuccess,
} from "../features/user/userSlice";
import { toast } from "react-toastify";

function ForgotPassword() {
  const { loading, error, success, message } = useSelector(
    (state) => state.user,
  );
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const forgotPasswordEmail = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("email", email);
    dispatch(forgotPassword(myForm));
    setEmail("");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(removeSuccess());
    }
  }, [dispatch, success, message]);
  return (
    <>
      <PageTitle title="Forgot Password" />
      <Navbar />
      <div className="container forgot-container">
        <div className="form-content email-group">
          <form className="form" onSubmit={forgotPasswordEmail}>
            <h2>Forgot Password</h2>
            <div className="input-group">
              <input
                type="email"
                placeholder="Enter your registered email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="authBtn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ForgotPassword;
