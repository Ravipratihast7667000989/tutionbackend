import Banner from "../models/bannersModel.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";


// Upload Banner

export const uploadBanner = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Image Required"
            });

        }

        const uploadImage = () =>
            new Promise((resolve, reject) => {

                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "banners",
                    },
                    (error, result) => {

                        if (error) reject(error);
                        else resolve(result);

                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);

            });

        const result = await uploadImage();

        const banner = await Banner.create({

            image: result.secure_url,
            public_id: result.public_id,

        });

        res.status(201).json({

            success: true,
            message: "Banner Uploaded",
            banner,

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};




// Fetch Banner

export const getBanners = async (req, res) => {

    try {

        const banners = await Banner.find().sort({ createdAt: -1 });

        res.status(200).json({

            success: true,
            banners,

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message,

        });

    }

};




// Delete Banner

export const deleteBanner = async (req, res) => {

    try {

        const banner = await Banner.findById(req.params.id);

        if (!banner) {

            return res.status(404).json({

                success: false,
                message: "Banner Not Found",

            });

        }

        await cloudinary.uploader.destroy(banner.public_id);

        await Banner.findByIdAndDelete(req.params.id);

        res.status(200).json({

            success: true,
            message: "Banner Deleted",

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message,

        });

    }

};