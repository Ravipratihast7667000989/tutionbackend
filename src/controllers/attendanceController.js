import Attendance from "../models/attendanceModel.js";
import cloudinary from "../utils/cloudinary.js";

export const markAttendance = async (req, res) => {
  try {
    const { studentRollNumber, status } = req.body;

    if (!studentRollNumber || !status) {
      return res.status(400).json({
        success: false,
        message: "studentRollNumber and status are required",
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
      studentRollNumber,
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

// get Attendance Mark

export const getAttendanceCount = async (req, res) => {
  try {
    const { studentRollNumber, status } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attendance = await Attendance.findByIdAndUpdate(
      { student: studentRollNumber, date: today },
      { status },
      { upsert: true, new: true }

    );
    res.json({
      success:true,
      attendance,
    });

  } catch (error) {
    res.status(500).json({message:error.message});

  }
};

// attendance length count

export const AttendanceCount = async(req,res)=>{
  try {
    const {studentRollNumber} = req.params;

    const present = await Attendance.countDocuments({
      student:studentRollNumber,
      status: "present",
    });
     const absent = await Attendance.countDocuments({
      student:studentRollNumber,
      status: "absent",
    });
     const late = await Attendance.countDocuments({
      student:studentRollNumber,
      status: "late",
    });

    // const totalcount = await ({
    //   student:studentRollNumber,
    //   status:"present"+"absent"+"late",
    // })
    res.json({
      present,
      absent,
      late,
      total:present+absent+late,
    });

    
  } catch (error) {
    res.status(500).json({message:error.message});
    
  }

};

// select start and end date
export const monthlyAttendance =async(studentRollNumber)=>{
  try {
    const {studentRollNumber,month,year} = req.query;
    const start = new Date(year , month - 1,1);
    const end  = new Date(year,month,0);
    const data = await Attendance.find({
      student:studentRollNumber,
      date: { $gte:start , $lte:end} ,
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({message:error.message});
  }

};