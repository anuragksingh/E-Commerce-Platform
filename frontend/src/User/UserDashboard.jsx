import React, { useEffect, useRef, useState } from "react";
import "../UserStyles/UserDashboard.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout, removeSuccess } from "../features/user/userSlice";

function UserDashboard({ user }) {
  const { cartItems } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuVisible, setMenuVisible] = useState(false);

  const menuRef = useRef();

  /* =========================
     CLOSE ON OUTSIDE CLICK
  ========================= */

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  function toggleMenu() {
    setMenuVisible(!menuVisible);
  }

  const options = [
    { name: "Orders", funcName: orders },
    { name: "Account", funcName: profile },
    {
      name: `Cart(${cartItems.length})`,
      funcName: myCart,
      isCart: true,
    },
    { name: "Logout", funcName: logoutUser },
  ];

  if (user?.role === "admin") {
    options.unshift({
      name: "Admin Dashboard",
      funcName: dashboard,
    });
  }

  function orders() {
    navigate("/orders/user");
    setMenuVisible(false);
  }

  function profile() {
    navigate("/profile");
    setMenuVisible(false);
  }

  function myCart() {
    navigate("/cart");
    setMenuVisible(false);
  }

  function dashboard() {
    navigate("/admin/dashboard");
    setMenuVisible(false);
  }

  function logoutUser() {
    dispatch(logout())
      .unwrap()
      .then(() => {
        toast.success("Logout Successful");
        dispatch(removeSuccess());
        navigate("/login");
      })
      .catch((error) => {
        toast.error(error.message || "Logout Failed");
      });

    setMenuVisible(false);
  }

  return (
    <div className="dashboard-container" ref={menuRef}>
      <div className="profile-header" onClick={toggleMenu}>
        <img
          src={user?.avatar?.url || "./images/profile.png"}
          alt="Profile"
          className="profile-avatar_u"
        />

        <span className="profile-name">
          {user?.name || "User"}
        </span>
      </div>

      {menuVisible && (
        <div className="menu-options">
          {options.map((item) => (
            <button
              key={item.name}
              className={`menu-option-btn ${
                item.isCart
                  ? cartItems.length > 0
                    ? "cart-not-empty"
                    : ""
                  : ""
              }`}
              onClick={item.funcName}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;