import { useSelector } from "react-redux";
import Loader from "./Loader";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
function ProtectedRoute({ element, adminOnly = false }) {
  const { isAuthenticated, loading, user } = useSelector((state) => state.user);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== "admin") {
    toast.warning("Admin access only");
    return <Navigate to="/" />;
  }
  return element;
}

export default ProtectedRoute;
