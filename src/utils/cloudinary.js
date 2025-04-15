import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

async function uploadOnCloudinary(localFilePath) {

    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    // Upload an image
    const uploadResult = await cloudinary.uploader
        .upload(
            localFilePath, {
            public_id: 'avatar',
        }
        )
        .catch((error) => {
            console.log(error);
        });
    fs.unlinkSync(localFilePath)
    return uploadResult
};

export { uploadOnCloudinary }