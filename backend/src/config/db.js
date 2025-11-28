import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URI = process.env.MONGODB_URI || "mongodb://mongo:27017/stt-database";

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Connected to MongoDB:", URI);
  } catch (err) {
    console.error("Failed to connect MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
