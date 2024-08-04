const jwt = require("jsonwebtoken");
const express = require("express");
const authenticateToken = require("../config/auth");
const connection = require("../config/connection");
const router = express.Router();
const bcrypt = require("bcryptjs"); // Thêm bcrypt để so sánh mật khẩu
const crypto = require("crypto");
const upload = require("../config/upload");
const Checker = require("../classes/Checker");
const nodemailer = require("nodemailer");
const transporter = require("../config/transporter");
const dotenv = require("dotenv");
const Fields = require("../classes/Fields");

router.post("/login", (req, res) => {
  const { email, matkhau } = req.body;

  // Kiểm tra xem email và mật khẩu có được cung cấp không
  if (!email || !matkhau) {
    return res.status(400).json({ error: "validation failed" });
  }

  // Truy vấn người dùng từ cơ sở dữ liệu dựa trên email
  connection.query(
    "SELECT * FROM NguoiDung WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Nếu không tìm thấy người dùng
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = results[0];

      // So sánh mật khẩu người dùng cung cấp với mật khẩu đã mã hóa trong cơ sở dữ liệu
      try {
        const match = await bcrypt.compare(matkhau, user.matkhau);

        if (!match) {
          return res.status(401).json({
            error: "Invalid credentials",
          });
        }

        // Tạo token JWT
        const accessToken = jwt.sign(
          { id: user.id_nguoidung },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "24h" }
        );

        // Trả về token
        res.json({
          accessToken,
        });
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );
});

router.get("/profile", authenticateToken, (req, res) => {
  const fields = Fields.user(req.user.loaitaikhoan);
  const userId = req.user.id_nguoidung;
  const query =
    "SELECT " +
    fields.filter((item) => item !== "").join(", ") +
    " FROM NguoiDung WHERE id_nguoidung = ?";

  // Thực thi truy vấn
  connection.query(query, [userId], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.length === 0) {
      res.status(404).send("User not found"); // Trả về lỗi nếu không tìm thấy người dùng
    } else {
      res.status(200).json(results[0]); // Trả về thông tin người dùng
    }
  });
});

router.post("/register", upload.single(""), (req, res) => {
  const { email, matkhau, ten } = req.body;

  // return res.json({ a: req.body });

  // Kiểm tra xem email, mật khẩu và tên có được cung cấp không
  if (!email || !matkhau || !ten) {
    return res.status(400).json({ error: "Missing required field" });
  }

  // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
  connection.query(
    "SELECT * FROM NguoiDung WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Nếu email đã tồn tại
      if (results.length > 0) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Mã hóa mật khẩu
      try {
        const hashedPassword = await bcrypt.hash(matkhau, 10);

        // Thực hiện truy vấn để lưu người dùng mới vào cơ sở dữ liệu
        connection.query(
          "INSERT INTO NguoiDung (email, matkhau, ten) VALUES (?, ?, ?)",
          [email, hashedPassword, ten],
          (err, results) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            // Trả về token và thông tin người dùng
            res.status(201).json({
              message: "User registered",
              user: {
                id: results.insertId,
                email,
                ten,
              },
            });
          }
        );
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );
});

// Gửi email với token đặt lại mật khẩu
router.post("/forgot-password", upload.single(""), (req, res) => {
  const { email } = req.body;

  if (typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  } else if (Checker.checkEmail(email))
    return res.status(400).json({ error: "Invalid email format" });

  connection.query(
    "SELECT * FROM NguoiDung WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = results[0];
      const token = crypto.randomBytes(32).toString("hex");

      const tokenExpireTime = Date.now() + 3600000; // Token có thời hạn 1 giờ

      connection.query(
        "UPDATE NguoiDung SET resetToken = ?, resetTokenExpire = ? WHERE id_nguoidung = ?",
        [token, tokenExpireTime, user.id_nguoidung],
        (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          const resetLink = process.env.FRONEND_HOST + `/${token}`;

          // Gửi email với link đặt lại mật khẩu
          const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Password Reset",
            text: `Please click the following link to reset your password: ${resetLink}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.status(500).json({ error: error.message });
            }
            res.json({
              message: "Reset password link has been sent to your email.",
            });
          });
        }
      );
    }
  );
});

// Đặt lại mật khẩu
router.post("/reset-password/:token", upload.single(""), (req, res) => {
  const { token } = req.params;
  const { matkhau } = req.body;

  if (!matkhau) {
    return res.status(400).json({ error: "Password is required" });
  }

  connection.query(
    "SELECT * FROM NguoiDung WHERE resetToken = ? AND resetTokenExpire > ?",
    [token, Date.now()],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      const user = results[0];
      const hashedPassword = await bcrypt.hash(matkhau, 10);

      connection.query(
        "UPDATE NguoiDung SET matkhau = ?, resetToken = NULL, resetTokenExpire = NULL WHERE id_nguoidung = ?",
        [hashedPassword, user.id_nguoidung],
        (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: "Password has been reset successfully." });
        }
      );
    }
  );
});

router.post(
  "/change-password",
  authenticateToken,
  upload.single(""),
  async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id_nguoidung; // Lấy ID người dùng từ JWT token đã được xác thực

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both old and new passwords are required" });
    }

    connection.query(
      "SELECT matkhau FROM NguoiDung WHERE id_nguoidung = ?",
      [userId],
      async (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        const user = results[0];

        // Kiểm tra mật khẩu cũ có đúng không
        const isMatch = await bcrypt.compare(oldPassword, user.matkhau);
        if (!isMatch) {
          return res.status(401).json({ error: "Old password is incorrect" });
        }

        // Mã hóa mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu trong cơ sở dữ liệu
        connection.query(
          "UPDATE NguoiDung SET matkhau = ? WHERE id_nguoidung = ?",
          [hashedNewPassword, userId],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            res.json({ message: "Password has been changed successfully" });
          }
        );
      }
    );
  }
);

/////////////////////
module.exports = router;
