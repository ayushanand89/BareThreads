import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), async(req, res) => {
  try {
    if(!req.file) {
      return res.status(400).json({ message: "No file Uploaded"}); 
    }

    // Function to handle the stream upload to Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if(result) {
            resolve(result); 
          } else {
            reject(error); 
          }
        }); 

        // Use Streamifier to convert file buffer to a stream
        streamifier.createReadStream(fileBuffer).pipe(stream); 
      })
    }

    // Call the streamUpload function
    const result = await streamUpload(req.file.buffer); 

    // Respond with the uploaded image url 
    res.json({ imageUrl: result.secure_url }); 
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Server Error"}); 
  }
})


export default router;
