const express = require("express");
const router = express.Router();
const connection = require("../config/connection");
const authenticateToken = require("../config/auth");
const Fields = require("../classes/Fields");

// Lấy danh sách các tin yêu thích của người dùng
router.get("/", authenticateToken, (req, res) => {
  let fields = Fields.post(req.user.loaitaikhoan);

  const query =
    "SELECT " + fields.join(", ") + " FROM LuotTim WHERE id_nguoidung = ?";

  connection.query(query, [req.user.id_nguoidung], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Thêm một tin vào danh sách yêu thích
router.post("/", authenticateToken, (req, res) => {
  const { id_baiviet } = req.body;

  // Kiểm tra dữ liệu
  if (!id_baiviet) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = "INSERT INTO LuotTim (id_nguoidung, id_baiviet) VALUES (?, ?)";

  // Thực thi truy vấn
  connection.query(
    query,
    [req.user.id_nguoidung, id_baiviet],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res
          .status(201)
          .json({ message: "Post added to favorites successfully" });
      }
    }
  );
});

// Xóa một tin khỏi danh sách yêu thích
router.delete("/:id_baiviet", authenticateToken, (req, res) => {
  const { id_baiviet } = req.params;

  const query = "DELETE FROM LuotTim WHERE id_nguoidung = ? AND id_baiviet = ?";

  // Thực thi truy vấn
  connection.query(
    query,
    [req.user.id_nguoidung, id_baiviet],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: "Post not found in favorites" });
      } else {
        res
          .status(200)
          .json({ message: "Post removed from favorites successfully" });
      }
    }
  );
});

module.exports = router;
