const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Lấy từ biến môi trường
  api_key: process.env.CLOUDINARY_API_KEY, // Lấy từ biến môi trường
  api_secret: process.env.CLOUDINARY_API_SECRET, // Lấy từ biến môi trường
});

// Cấu hình Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Bookland",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

const upload = multer({ storage: storage });

// Route để tải lên ảnh
router.post("/upload", upload.single("image"), (req, res) => {
  res.json({ url: req.file.path });
});

module.exports = router;
