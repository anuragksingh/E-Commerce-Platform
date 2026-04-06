import { useDispatch, useSelector } from "react-redux";
import "../UserStyles/Form.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeSuccess, updatePassword } from "../features/user/userSlice";
import { toast } from "react-toastify";
import { removeErrors } from "../features/user/userSlice";
import Loader from "../components/Loader";

function UpdatePassword() {
  const { loading, success, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePasswordSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);
    for (let pair of myForm.entries()) {
      console.log(pair[0] + "-" + pair[1]);
    }
    dispatch(updatePassword(myForm));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success("Password Updated successfully");
      dispatch(removeSuccess());
      navigate("/profile");
    }
  }, [dispatch, navigate, success]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <PageTitle title="Password Update" />
          <div className="container update-container">
            <div className="form-content">
              <form className="form" onSubmit={updatePasswordSubmit}>
                <h2>Update Password</h2>

                <div className="input-group">
                  <input
                    type="password"
                    name="oldPassword"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button className="authBtn" disabled={loading}>
                  {loading ? "Updating Password..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default UpdatePassword;
// 16:48:44
