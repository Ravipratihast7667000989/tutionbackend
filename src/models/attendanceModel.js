import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,

    },
    studentRollNumber: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // image URL or filename
      default: "",
    },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);