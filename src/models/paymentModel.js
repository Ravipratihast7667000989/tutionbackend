// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema(
//   {
//     orderId: String,
//     paymentId: String,
//     amount: Number, // store in rupees
//     amountInPaise: Number,
//     status: {
//       type: String,
//       default: "created",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Payment", paymentSchema);


import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: String,
  razorpay_payment_id: String,
  amount: Number,
  studentName: String,
  mobile: String,
  rollNo: String,
  status: String
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);