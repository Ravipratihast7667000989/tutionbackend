import Attendance from "../models/attendanceModel.js";
import cloudinary from "../utils/cloudinary.js";

export const markAttendance = async (req, res) => {
  try {
    const { studentName, status } = req.body;

    if (!studentName || !status) {
      return res.status(400).json({
        success: false,
        message: "studentName and status are required",
      });
    }

    let imageUrl = "";
    let publicId = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "attendance_students",
      });

      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    const attendance = await Attendance.create({
      studentName,
      image: imageUrl,
      public_id: publicId,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ Get All Students (GET)
export const getAStudents = async (req, res) => {
  try {
    const students = await Attendance.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
