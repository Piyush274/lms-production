const cloudinary = require("cloudinary").v2;
const { extractPublicId } = require('cloudinary-build-url')
const axios = require('axios');
const { Readable } = require('stream');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadFile = async (file) => {
    try {

        const base64String = file.buffer.toString('base64');

        const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${base64String}`, {
            folder: 'real-brave',
            resource_type: 'auto'
        });
        return result.secure_url;

    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};

const deleteImage = async (cloudinaryUrl) => {
    try {

        const publicId = extractPublicId(cloudinaryUrl)
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('✌️result --->', result);

        return { status: 200, success: true, message: 'Image deleted successfully' };
    } catch (error) {
        console.log("deleteImage ~ error:", error);
        return { status: 500, success: false, message: error.message };
    }
};

const copyFileToDifferentFolder = async (fileUrl, destinationFolder) => {
    try {
        // Fetch the file from the provided URL
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        const fileBuffer = Buffer.from(response.data);

        // Extract the file type (image/video) based on the URL
        const isVideo = fileUrl.includes('/video/');
        const resourceType = isVideo ? 'video' : 'image';

        // Set a unique public ID for the file
        const timestamp = Date.now();
        const randomName = `copied_file_${timestamp}`;

        // Upload the file to the new folder in Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    folder: 'real-brave',
                    public_id: randomName,
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            // Use a readable stream to upload the file
            const stream = Readable.from(fileBuffer);
            stream.pipe(uploadStream);
        });

        // Return the secure URL of the uploaded file
        return result.secure_url;
    } catch (error) {
        return { status: 500, success: false, message: error.message };
    }
};



module.exports = { uploadFile, deleteImage,copyFileToDifferentFolder };