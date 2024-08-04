const multer = require("multer");
const cloudinary = require("./cloudinary");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: process.env.CLOUD_FOLDER,
    format: async (req, file) => {
      // Tự động xác định định dạng từ phần mở rộng của tệp tin
      const extension = file.originalname.split(".").pop();
      const validFormats = ["jpg", "jpeg", "png", "webp", "gif"];
      return validFormats.includes(extension) ? extension : "jpg"; // Mặc định là jpg nếu định dạng không hợp lệ, // supports promises as well
    },
    public_id: (req, file) => {
      // Tạo public_id sử dụng đường dẫn (path) và tên gốc của tệp tin
      const extname = path.extname(file.originalname); // Lấy phần mở rộng của tệp tin
      const basename = path.basename(file.originalname, extname); // Lấy tên gốc của tệp tin mà không có phần mở rộng
      const timestamp = Date.now(); // Tạo một timestamp để đảm bảo tính duy nhất
      const endpoint = `${basename}-${timestamp}`;
      // req.avt = req.file ? req.file.path : null;
      return endpoint;
    },
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    const validFormats = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    if (validFormats.includes(extname)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file format. Only jpg, jpeg, png, GIF, and webp are allowed."
        )
      );
    }
  },
});

module.exports = upload;
