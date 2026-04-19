import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Forgot Password OTP</h2>
          <h1 style="color:blue">${otp}</h1>
          <p>This OTP expires in 5 minutes.</p>
        </div>
      `,
    });

    console.log("OTP email sent successfully");
  } catch (error) {
    console.log("Email Error:", error);
    throw error;
  }
};

export default sendEmail;