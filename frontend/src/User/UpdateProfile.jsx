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
  const { user, error, success, message, loading } = useSelector(
    (state) => state.user
  );

  // 🔴 form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
  () => user?.avatar?.url || "./imagesprofile.png"
);

  // 🔴 track if user started typing
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔴 image handler
  const profileImageUpdate = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.onerror = () => {
      toast.error("Error reading file");
    };

    reader.readAsDataURL(file);
  };

  // 🔴 submit
  const updateSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    // fallback only at submit time
    myForm.set("name", nameTouched ? name : user?.name);
    myForm.set("email", emailTouched ? email : user?.email);

    if (avatar) {
      myForm.set("avatar", avatar);
    }

    dispatch(updateProfile(myForm));
  };

  // 🔴 response handling
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }

    if (message && success === false) {
      toast.info(message);
      dispatch(removeSuccess());
    }

    if (success) {
      toast.success(message);
      dispatch(removeSuccess());
      navigate("/profile");
    }
  }, [dispatch, error, success, message, navigate]);

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

                <div className="input-group avatar-group">
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input"
                    name="avatar"
                    onChange={profileImageUpdate}
                  />
                  <img
                    src={avatarPreview || user?.avatar?.url}
                    alt="User Profile"
                    className="avatar"
                  />
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    value={nameTouched ? name : user?.name || ""}
                    onChange={(e) => {
                      setNameTouched(true);
                      setName(e.target.value);
                    }}
                  />
                </div>

                <div className="input-group">
                  <input
                    type="email"
                    value={emailTouched ? email : user?.email || ""}
                    onChange={(e) => {
                      setEmailTouched(true);
                      setEmail(e.target.value);
                    }}
                  />
                </div>

                <button className="authBtn" disabled={loading}>
                  {loading ? "Updating..." : "Update"}
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
