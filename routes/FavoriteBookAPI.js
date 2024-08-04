const express = require("express");
const router = express.Router();
const connection = require("../config/connection");
const authenticateToken = require("../config/auth");
const Fields = require("../classes/Fields");

// Lấy danh sách sách yêu thích của người dùng
router.get("/", authenticateToken, (req, res) => {
  let fields = Fields.book(req.user.loaitaikhoan);

  const query =
    "SELECT " + fields.join(", ") + " FROM SachYeuThich WHERE id_nguoidung = ?";

  connection.query(query, [req.user.id_nguoidung], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Thêm một sách vào danh sách yêu thích
router.post("/", authenticateToken, (req, res) => {
  const { id_sach } = req.body;

  // Kiểm tra dữ liệu
  if (!id_sach) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query =
    "INSERT INTO SachYeuThich (id_nguoidung, id_sach) VALUES (?, ?)";

  // Thực thi truy vấn
  connection.query(query, [req.user.id_nguoidung, id_sach], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: "Book added to favorites successfully" });
    }
  });
});

// Xóa một sách khỏi danh sách yêu thích
router.delete("/:id_sach", authenticateToken, (req, res) => {
  const { id_sach } = req.params;

  const query =
    "DELETE FROM SachYeuThich WHERE id_nguoidung = ? AND id_sach = ?";

  // Thực thi truy vấn
  connection.query(query, [req.user.id_nguoidung, id_sach], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Book not found in favorites" });
    } else {
      res
        .status(200)
        .json({ message: "Book removed from favorites successfully" });
    }
  });
});

module.exports = router;
