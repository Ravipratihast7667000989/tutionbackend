// // utils/otp.js
export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// import crypto from "crypto";
// export const generateOTP = crypto.randomInt(100000, 999999).toString();