import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../components/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { removeErrors, removeSuccess, resetPassword } from "../features/user/userSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function ResetPassword() {
  const {token} = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loading, success, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    const data = {
      password,
      confirmPassword,
    };
    dispatch(resetPassword({ token, userData: data }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if(success){
        toast.success("Password Reset Successful")
        dispatch(removeSuccess())
        navigate('/login')
    }
  }, [dispatch, success, navigate])

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="Reset Password" />
          <div className="container update-container">
            <div className="form-content">
              <form className="form" onSubmit={resetPasswordSubmit}>
                <h2>Reset Password</h2>

                <div className="input-group">
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  {loading ? "Resetting Password..." : "Reset Password"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default ResetPassword;
