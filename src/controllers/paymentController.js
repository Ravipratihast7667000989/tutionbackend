
import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Payment from "../models/paymentModel.js";

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      amount,
    } = req.body;

    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (sign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const payment = await Payment.create({
      userId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      razorpay_signature:razorpay_signature,
      amount,
      status: "sucess",
    });

    return res.status(200).json({
      success: true,
      message: "Payment captured automatically",
      payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
       amount: Number(amount) * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        app: "flutter_app",
      },
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};