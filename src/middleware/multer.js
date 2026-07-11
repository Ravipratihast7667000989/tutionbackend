import multer from "multer";

const storage = multer.diskStorage({});

const productupload = multer({ storage });

export default productupload;