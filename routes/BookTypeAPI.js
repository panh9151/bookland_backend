const express = require("express");
const router = express.Router();
const connection = require("../config/connection");
const authenticateToken = require("../config/auth");
// const authenticateToken = require("../config/authOptional");
const Checker = require("../classes/Checker");
const { v4: uuidv4 } = require("uuid");

// Lấy tất cả thể loại
router.get("/", authenticateToken, (req, res) => {
  // Xây dựng truy vấn SQL
  const query = "SELECT * FROM TheLoai";

  // Thực thi truy vấn
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Lấy một thể loại theo ID
router.get("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  // Xây dựng truy vấn SQL
  const query = "SELECT * FROM TheLoai WHERE id_theloai = ?";

  // Thực thi truy vấn
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.json(results[0]);
    }
  });
});

// Thêm một thể loại mới
router.post("/", authenticateToken, async (req, res) => {
  const { ten } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!ten) {
    return res.status(400).json({ error: "Name is required" });
  }

  // Kiểm tra dữ liệu đầu vào
  const isNameValid = Checker.checkCategoryName(ten);
  if (isNameValid) {
    return res.status(400).json({ error: isNameValid });
  }

  // Tạo id_thể_loại mới
  const id_theloai = uuidv4();

  // Xây dựng truy vấn SQL để thêm thể loại
  const query = `
    INSERT INTO TheLoai (id_theloai, ten) VALUES (?, ?)`;
  const queryParams = [id_theloai, ten];

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({
        message: "Category created successfully",
        categoryId: id_theloai,
      });
    }
  });
});

// Cập nhật thông tin thể loại
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { ten } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!ten) {
    return res.status(400).json({ error: "Name is required" });
  }

  // Kiểm tra dữ liệu đầu vào
  const isNameValid = Checker.checkCategoryName(ten);
  if (isNameValid) {
    return res.status(400).json({ error: isNameValid });
  }

  // Xây dựng truy vấn SQL để cập nhật thể loại
  const query = `
    UPDATE TheLoai SET ten = ? WHERE id_theloai = ?`;
  const queryParams = [ten, id];

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.status(200).json({ message: "Category updated successfully" });
    }
  });
});

// Xóa một thể loại theo ID
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  // Xây dựng truy vấn SQL để xóa thể loại
  const query = `
    DELETE FROM TheLoai WHERE id_theloai = ?`;

  // Thực thi truy vấn
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.status(200).json({ message: "Category deleted successfully" });
    }
  });
});

module.exports = router;
