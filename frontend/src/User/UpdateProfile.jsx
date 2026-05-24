import "../UserStyles/Form.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  removeSuccess,
  updateProfile,
  removeErrors,
} from "../features/user/userSlice";

import Loader from "../components/Loader";

function UpdateProfile() {
  const { user, error, success, message, loading } =
    useSelector((state) => state.user);

  // FORM STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // STORE REAL FILE
  const [avatar, setAvatar] = useState(null);

  // IMAGE PREVIEW
  const [avatarPreview, setAvatarPreview] =
    useState(
      () =>
        user?.avatar?.url ||
        "./imagesprofile.png"
    );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // SET USER DATA
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");

      setAvatarPreview(
        user?.avatar?.url ||
          "./imagesprofile.png"
      );
    }
  }, [user]);

  // IMAGE CHANGE HANDLER
  const profileImageUpdate = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // STORE ACTUAL FILE
    setAvatar(file);

    // PREVIEW IMAGE
    setAvatarPreview(
      URL.createObjectURL(file)
    );
  };

  // FORM SUBMIT
  const updateSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);

    // SEND FILE
    if (avatar) {
      myForm.append("avatar", avatar);
    }

    dispatch(updateProfile(myForm));
  };

  // RESPONSE HANDLING
  useEffect(() => {
    if (error) {
      toast.error(error);

      dispatch(removeErrors());
    }

    if (
      message &&
      success === false
    ) {
      toast.info(message);

      dispatch(removeSuccess());
    }

    if (success) {
      toast.success(message);

      dispatch(removeSuccess());

      navigate("/profile");
    }
  }, [
    dispatch,
    error,
    success,
    message,
    navigate,
  ]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />

          <div className="container update-container">
            <div className="form-content">
              <form
                className="form"
                encType="multipart/form-data"
                onSubmit={updateSubmit}
              >
                <h2>Update Profile</h2>

                {/* PROFILE IMAGE */}
                <div className="input-group avatar-group">
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input"
                    name="avatar"
                    onChange={
                      profileImageUpdate
                    }
                  />

                  <img
                    src={avatarPreview}
                    alt="User Profile"
                    className="avatar"
                  />
                </div>

                {/* NAME */}
                <div className="input-group">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    placeholder="Enter your name"
                  />
                </div>

                {/* EMAIL */}
                <div className="input-group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="Enter your email"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  className="authBtn"
                  disabled={loading}
                >
                  {loading
                    ? "Updating..."
                    : "Update"}
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

export default UpdateProfile;