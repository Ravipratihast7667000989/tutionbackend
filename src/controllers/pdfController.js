
import cloudinary from "../utils/cloudinary.js";
import File from "../models/pdfmodel.js";
import fs from "fs";

// ✅ Upload
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const isPDF = req.file.mimetype === "application/pdf";

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: isPDF ? "raw" : "image",
      folder: "uploads",
    });

    const file = new File({
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType: isPDF ? "pdf" : "image",
      name: req.body.name,
    });

    await file.save();

    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "File uploaded",
      data: file,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Get All Files
export const getFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Download File
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Redirect to Cloudinary URL
    return res.redirect(file.fileUrl);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Delete File
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    await cloudinary.uploader.destroy(file.publicId, {
      resource_type: file.fileType === "pdf" ? "raw" : "image",
    });

    await File.findByIdAndDelete(req.params.id);

    res.json({ message: "File deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};