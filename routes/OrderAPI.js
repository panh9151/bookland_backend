const express = require("express");
const router = express.Router();
const connection = require("../config/connection");
const authenticateToken = require("../config/auth");
const Checker = require("../classes/Checker");
const Fields = require("../classes/Fields");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Cấu hình transporter cho nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Sử dụng dịch vụ email, có thể thay đổi theo nhu cầu
  auth: {
    user: process.env.EMAIL_USER, // Địa chỉ email của bạn
    pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng hoặc mật khẩu email của bạn
  },
});

// Lấy danh sách đơn hàng của người dùng
router.get("/", authenticateToken, (req, res) => {
  let fields = Fields.order(req.user.loaitaikhoan);

  const query =
    "SELECT " + fields.join(", ") + " FROM DonHang WHERE id_nguoidung = ?";

  connection.query(query, [req.user.id_nguoidung], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Thêm một đơn hàng mới
router.post("/", authenticateToken, (req, res) => {
  const { diachi, sdt, nguoinhan, phuongthucthanhtoan, ghichu, ngaygiaohang } =
    req.body;

  // Kiểm tra dữ liệu
  if (!diachi || !sdt || !nguoinhan || !phuongthucthanhtoan) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO DonHang (id_nguoidung, diachi, sdt, nguoinhan, phuongthucthanhtoan, ghichu, ngaydat, ngaygiaohang, trangthai, thanhtoan)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 0)`;

  const queryParams = [
    req.user.id_nguoidung,
    diachi,
    sdt,
    nguoinhan,
    phuongthucthanhtoan,
    ghichu || null,
    new Date(),
    ngaygiaohang || null,
  ];

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // Gửi email cho người dùng
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.user.email,
        subject: "Order Confirmation",
        text: `Your order has been placed successfully. Order ID: ${results.insertId}.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email: ", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.status(201).json({
        message: "Order placed successfully",
        orderId: results.insertId,
      });
    }
  });
});

// Cập nhật trạng thái đơn hàng
router.put("/:id_donhang", authenticateToken, (req, res) => {
  const { id_donhang } = req.params;
  const { trangthai, thanhtoan } = req.body;

  // Kiểm tra trạng thái và thanh toán
  if (trangthai === undefined || thanhtoan === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    UPDATE DonHang
    SET trangthai = ?, thanhtoan = ?
    WHERE id_donhang = ? AND id_nguoidung = ?`;

  const queryParams = [trangthai, thanhtoan, id_donhang, req.user.id_nguoidung];

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.affectedRows === 0) {
      res
        .status(404)
        .json({ error: "Order not found or not authorized to update" });
    } else {
      res.status(200).json({ message: "Order updated successfully" });
    }
  });
});

module.exports = router;
