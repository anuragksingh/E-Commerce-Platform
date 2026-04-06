import { Link, useLocation, useNavigate } from "react-router-dom";
import "../UserStyles/Form.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, removeErrors, removeSuccess } from "../features/user/userSlice";
import { toast } from "react-toastify";

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { error, success, isAuthenticated } = useSelector(
    (state) => state.user,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email: loginEmail, password: loginPassword }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  useEffect(() => {
    if (success) {
      toast.success("Login Successful");
      dispatch(removeSuccess());
    }
  }, [dispatch, success]);

  return (
    <div className="form-container container">
      <div className="form-content">
        <form className="form" onSubmit={loginSubmit}>
          <h2>Login</h2>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>
          <button className="authBtn">Sign In</button>
          <p className="form-links">
            Forgot your password?
            <Link to="/password/forgot">Reset Here</Link>
          </p>
          <p className="form-links">
            Don't hava an accout?
            <Link to="/register">Sign up here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
