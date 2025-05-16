import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`connected successfully to database ${conn.connection.name}`);
  } catch (error) {
    console.log("mongodb connection error", error);
  }
};
