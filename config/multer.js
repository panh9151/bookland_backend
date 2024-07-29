const multer = require("multer");

// Cấu hình lưu trữ file (sử dụng bộ nhớ RAM)
const storage = multer.memoryStorage();

// Tạo một định dạng file
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận ảnh JPEG, PNG hoặc GIF"), false);
  }
};

// Khởi tạo Multer với cấu hình lưu trữ và kiểm tra loại file
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // Giới hạn kích thước file là 2MB
  },
});

module.exports = { upload };
