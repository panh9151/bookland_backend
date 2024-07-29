const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config();

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
    folder: "Bookland", // Tên thư mục lưu trữ hình ảnh trên Cloudinary
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };
