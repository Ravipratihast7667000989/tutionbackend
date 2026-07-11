import express from "express";

import upload from "../middleware/authMiddleware.js";

import {
    uploadBanner,
    getBanners,
    deleteBanner,
} from "../controllers/bannerController.js";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadBanner);

router.get("/all", getBanners);

router.delete("/delete/:id", deleteBanner);

export default router;