import mongoose from "mongoose";
import Counter from "./counterModel.js";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      unique: true,
    },
    name: String,
    course: String,
    email: String,
  },
  { timestamps: true }
);

// auto student ID generate
studentSchema.pre("save", async function () {
  if (!this.isNew) return;

  const counter = await Counter.findOneAndUpdate(
    { id: "studentId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const year = new Date().getFullYear();
  this.studentId = `STU${year}${String(counter.seq).padStart(4, "0")}`;
});

export default mongoose.model("Student", studentSchema);