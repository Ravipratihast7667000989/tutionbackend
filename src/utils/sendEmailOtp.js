// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//       user: process.env.USER_EMAIL,
//       pass: process.env.USER_PASS,
//   },
// });

// export const sendEmailOTP = async (email, otp) => {
//   try {
//     await transporter.sendMail({
//       from: process.env.USER_EMAIL,
//       to: email,
//       subject: "Forgot Password OTP",
//       html: `
//         <div style="font-family:Arial;padding:20px">
//           <h2>Password Reset OTP</h2>
//           <p>Your OTP is:</p>
//           <h1>${otp}</h1>
//           <p>OTP expires in 5 minutes.</p>
//         </div>
//       `,
//     });

//     console.log("OTP email sent successfully");
//   } catch (error) {
//     console.log("Email error:", error);
//     throw error;
//   }
// };