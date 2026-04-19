// controllers/authController.js
import bcrypt from "bcrypt";
import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";
import { generateOTP } from "../utils/otp.js";
import { generateToken } from "../utils/jwt.js";
import sendEmail from "../utils/sendEmail.js";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  const { firstname,lastname,mobileNumber, email, password,image } = req.body;

     const mobileExists = await User.findOne({ mobileNumber });

    if (mobileExists) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

  const oldUser = await User.findOne({email});
  if(oldUser){
    return res.status(400).json({
      success: false,
      message: "User already registerd"
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10);

 
     let imageUrl = "";
     let publicId = "";
 
     if (req.file) {
       const result = await cloudinary.uploader.upload(req.file.path, {
         folder: "users_students",
       });
 
       imageUrl = result.secure_url;
       publicId = result.public_id;
     }
 

  const user = await User.create({
    firstname,
    lastname,
    mobileNumber,
    email,
    password: hashedPassword,
    image: imageUrl
  });

  res.status(201).json({
    message: "Registered successfully",
    user: {
      firstname: user.firstname,
      lastname:user.lastname,
      mobileNumber:user.mobileNumber,
      email: user.email,
      image: user.image
    }
  });
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = generateToken(user._id);

  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
      image: user.image
    }
  });
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save();
  await sendEmail(email, otp);

  console.log("OTP:", otp); // send via email/
  

  res.json({ message: "OTP sent successfully" });
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {

  try {
    const { email, otp } = req.body;

    // 1️⃣ Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // 3️⃣ Check expiry
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // 4️⃣ OTP verified = true
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      isVerified: user.isVerified,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= Change PASSWORD ================= */
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    console.log(req.body);
console.log(newPassword);
    return res.status(400).json({ message: "User Not register" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  console.log(user.password);
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ message: "Password reset successful" });
};


export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ user check
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ already verified
    // if (user.isVerified) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Email already verified",
    //   });
    // }

    // 3️⃣ cooldown 30 sec
    const cooldown = 30 * 1000;

    if (
      user.otpSentAt &&
      Date.now() - new Date(user.otpSentAt).getTime() < cooldown
    ) {
      const remaining = Math.ceil(
        (cooldown -
          (Date.now() - new Date(user.otpSentAt).getTime())) /
          1000
      );

      return res.status(429).json({
        success: false,
        message: `Please wait ${remaining}s before resend OTP`,
      });
    }

    // 4️⃣ generate new otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 5️⃣ save
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    user.otpSentAt = Date.now();

    await user.save();

    // 6️⃣ send mail
    await sendEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const searchStudents = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const students = await User.find({
      studentName: {
        $regex: keyword,
        $options: "i", // case-insensitive
      },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};


// UPDATE API
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, course } = req.body;

    const student = await User.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    let image = student.image;
    let public_id = student.public_id;

    // If new image uploaded
    if (req.file) {
      // Delete old image from cloudinary
      if (student.public_id) {
        await cloudinary.uploader.destroy(student.public_id);
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "users",
      });

      image = result.secure_url;
      public_id = result.public_id;
    }

    const updatedStudent = await User.findByIdAndUpdate(
      id,
      {
        name,
        course,
        image,
        public_id,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};