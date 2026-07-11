import express from "express";
import productupload from "../middleware/multer.js";
import { createProduct ,getAllProducts} from "../controllers/productController.js";

const router = express.Router();

router.post("/create", productupload.single("image"), createProduct);
router.get("/all", getAllProducts);

export default router;