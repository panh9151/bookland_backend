const express = require("express");
const router = express.Router();
const connection = require("../config/connection");
const Checker = require("../classes/Checker");

// Tìm kiếm sách và tác giả
router.get("/", (req, res) => {
  const queryString = req.query.q;

  // Kiểm tra chuỗi tìm kiếm
  if (!queryString || queryString.trim() === "") {
    return res.status(400).json({ error: "Search query cannot be empty" });
  }

  const searchTerm = `%${queryString.trim()}%`;

  // Tìm kiếm sách
  const booksQuery = `
    SELECT id_sach, ten, nxb, img, mota, namxuatban, gia
    FROM Sach
    WHERE ten LIKE ?`;

  // Tìm kiếm tác giả
  const authorsQuery = `
    SELECT id_tacgia, ten, img, txt
    FROM TacGia
    WHERE ten LIKE ?`;

  // Thực thi truy vấn tìm kiếm sách và tác giả
  connection.query(booksQuery, [searchTerm], (err, booksResults) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    connection.query(authorsQuery, [searchTerm], (err, authorsResults) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Trả về kết quả tìm kiếm
      res.json({
        books: booksResults,
        authors: authorsResults,
      });
    });
  });
});

module.exports = router;
