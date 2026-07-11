import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
    fileUrl:String,
    publicId:String,
    fileType:String,
    name:String,
},{timestamps: true});

export default mongoose.model("Pdf",pdfSchema);