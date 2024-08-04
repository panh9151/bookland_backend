const express = require("express");
const router = express.Router();
const connection = require("../config/connection");
const authenticateToken = require("../config/auth");
const Checker = require("../classes/Checker");
const Fields = require("../classes/Fields");

// Lấy danh sách đánh giá của người dùng
router.get("/", authenticateToken, (req, res) => {
  let fields = Fields.rating(req.user.loaitaikhoan);

  const query =
    "SELECT " + fields.join(", ") + " FROM DanhGia WHERE id_nguoidung = ?";

  connection.query(query, [req.user.id_nguoidung], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Thêm một đánh giá mới
router.post("/", authenticateToken, async (req, res) => {
  const { id_sach, diem, txt } = req.body;

  // Kiểm tra dữ liệu
  if (!id_sach || !diem) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Kiểm tra giá trị của điểm đánh giá
  if (diem < 1 || diem > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  const query = `
    INSERT INTO DanhGia (id_nguoidung, id_sach, diem, txt, ngaytao)
    VALUES (?, ?, ?, ?, ?)`;

  const queryParams = [
    req.user.id_nguoidung,
    id_sach,
    diem,
    txt || null,
    new Date(),
  ];

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: "Rating added successfully" });
    }
  });
});

// Xóa một đánh giá theo ID
router.delete("/:id_danhgia", authenticateToken, (req, res) => {
  const { id_danhgia } = req.params;

  const query = "DELETE FROM DanhGia WHERE id_danhgia = ? AND id_nguoidung = ?";

  // Thực thi truy vấn
  connection.query(
    query,
    [id_danhgia, req.user.id_nguoidung],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (results.affectedRows === 0) {
        res
          .status(404)
          .json({ error: "Rating not found or not authorized to delete" });
      } else {
        res.status(200).json({ message: "Rating deleted successfully" });
      }
    }
  );
});

module.exports = router;
