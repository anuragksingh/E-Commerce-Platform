import HandleError from "../utils/handleError.js";
import handleAsyncError from "./handleAsyncError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(
      new HandleError(
        "Authentication is missing !Please login to access resource",
        401
      )
    );
  }
  const decodedDate = jwt.verify(token, process.env.JWT_KEY);
  req.user = await User.findById(decodedDate.id);
  next();
});

export const roleBasedAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new HandleError(
          `Role - ${req.user.role} is not allowed to access the resource`,
          403
        )
      );
    }
    next();
  };
};
