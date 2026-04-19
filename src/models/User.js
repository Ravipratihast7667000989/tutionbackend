// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  mobileNumber:{type:Number},
  email: { type: String, unique: true },
  password: String,
  image: String,
  
  otp: String,
  otpExpiry: Date,
  isVerified: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
