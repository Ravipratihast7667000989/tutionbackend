import Student from "../models/studentModel.js";

export const createStudent = async (req, res) => {
  try {
    const { name, course, email } = req.body;

    const student = await Student.create({
      name,
      course,
      email,
    });
    console.log(student);
    

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// export const searchStudents = async (req, res) => {
//   try {
//     const keyword = req.query.keyword || "";

//     const students = await Student.find({
//       studentName: {
//         $regex: keyword,
//         $options: "i", // case-insensitive
//       },
//     }).sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: students.length,
//       students,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Search failed",
//       error: error.message,
//     });
//   }
// };