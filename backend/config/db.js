import mongoose from "mongoose";

export const conectMongoDatabase = () => {
  mongoose.connect(process.env.DB_URI);
};
