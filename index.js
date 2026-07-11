
import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import bannerRoutes from "./src/routes/bannerRoutes.js";
import productRoutes from "./src/routes/productRoutes.js"
import cors from "cors";
dotenv.config();

connectDB();
const app = express();
app.use(cors({
  origin: "*",
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/auth", authRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/product",productRoutes);


app.listen(process.env.PORT||5000, () =>
  console.log("Server running on port 5000")
);
