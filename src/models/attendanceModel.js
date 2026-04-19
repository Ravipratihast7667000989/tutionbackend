import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    studentName: {
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