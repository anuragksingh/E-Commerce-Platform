import handleAsyncError from "../middleware/handleAsyncError.js";
import crypto from "crypto";
import User from "../models/user.model.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { v2 as cloudinary } from "cloudinary";

// Register
export const registerUser = handleAsyncError(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  const myCloud = await cloudinary.uploader.upload(avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  sendToken(user, 201, res);
});

// Login
export const loginUser = handleAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(HandleError("Email or Password cannot be empty", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new HandleError("Invalid Email or Password", 401));
  }

  const isPasswordValid = await user.verifyPassword(password);
  if (!isPasswordValid) {
    return next(new HandleError("Invalid Email or Password", 401));
  }
  sendToken(user, 200, res);
});

// Logout
export const logout = handleAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Successfully Logged out",
  });
});

// Forgot Password
export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new HandleError("User doesn't exist", 400));
  }
  let resetToken;
  try {
    resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    return next(
      new HandleError("Could not save reset token please try again later", 500),
    );
  }
 const resetPasswordURL = `${process.env.FRONTEND_URL}/reset/${resetToken}`;
  const message = `Use the following link to reset your password: ${resetPasswordURL}. \n\n This link will expire in 30 minutes. \n\n If you didn't request a password reset, please ignore this message.`;
  // Send Email
  try {
    await sendEmail({
      email,
      subject: "Password Reset Request",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email is sent to ${email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new HandleError("Email couldn't be sent, please try again later", 500),
    );
  }
});

// Reset Password
export const resetPassword = handleAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new HandleError(
        "Reset Password token is invaild or has been expired",
        400,
      ),
    );
  }
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(new HandleError("Password doesn't match", 400));
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

// Get user details
export const getUserDetails = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//update password
export const updatePassword = handleAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");
  const checkPasswordMatch = await user.verifyPassword(oldPassword);
  if (!checkPasswordMatch) {
    return next(new HandleError("Old password is incorrect", 400));
  }
  if (newPassword !== confirmPassword) {
    return next(new HandleError("Password doesn't match", 400));
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
});

// Updating user profile
// export const updateProfile = handleAsyncError(async (req, res, next) => {
//   const { name, email } = req.body;
//   const updateUserDetails = {
//     name,
//     email,
//   };
//   const user = await User.findByIdAndUpdate(req.user.id, updateUserDetails, {
//     new: true,
//     runValidators: true,
//   });
//   res.status(200).json({
//     success: true,
//     message: "Profile update successfully",
//     user,
//   });
// });
export const updateProfile = handleAsyncError(async (req, res, next) => {
  const { name, email, avatar } = req.body;

  // 1. Required fields
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and Email are required",
    });
  }

  // 2. Email format check
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  const currentUser = await User.findById(req.user.id);

  // 3. No changes case
  if (currentUser.name === name && currentUser.email === email) {
    return res.status(200).json({
      success: false,
      message: "No changes made",
    });
  }

  // 3.1 Avatar Updating process

  const updateUserDetails = {
    name,
    email,
  };

  if (avatar !== "") {
    const imageId = currentUser.avatar.public_id;
    await cloudinary.uploader.destroy(imageId);
    const myCloud = await cloudinary.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    updateUserDetails.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  // 4. Duplicate email check
  const existingUser = await User.findOne({ email });

  if (existingUser && existingUser._id.toString() !== req.user.id) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  // 5. Update
  const user = await User.findByIdAndUpdate(req.user.id, updateUserDetails, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

// Admin- getting user information
export const getUserList = handleAsyncError(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    success: true,
    user,
  });
});

// Admin- getting single user information
export const getSingleUser = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new HandleError(`User doesn't exist with this id: ${req.params.id}`, 400),
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Admin- Changing user role
export const updateUserRole = handleAsyncError(async (req, res, next) => {
  const { role } = req.body;
  const newUserData = {
    role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new HandleError("User doesn't exits", 400));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Admin- Delete user profile
export const deleteUser = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new HandleError("User doesn't exits", 400));
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
