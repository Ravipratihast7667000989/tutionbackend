
import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
dotenv.config();

connectDB();
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);

app.listen(process.env.PORT||5000, () =>
  console.log("Server running on port 5000")
);
