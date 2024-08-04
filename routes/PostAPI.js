const express = require("express");
const router = express.Router();
const connection = require("../config/connection");
const authenticateToken = require("../config/auth");
const upload = require("../config/upload");
const Checker = require("../classes/Checker");
const Fields = require("../classes/Fields");

// Lấy danh sách tất cả bài viết
router.get("/", authenticateToken, (req, res) => {
  let fields = Fields.post(req.user.loaitaikhoan);

  let query = "SELECT " + fields.join(", ") + " FROM BaiViet";
  const queryParams = [];
  const conditions = [];

  // Duyệt qua các query parameters và thêm vào điều kiện WHERE
  Object.keys(req.query).forEach((key) => {
    if (key !== "offset" && key !== "limit") {
      conditions.push(`${key} = ?`);
      queryParams.push(req.query[key]);
    }
  });

  // Nếu có điều kiện WHERE, thêm chúng vào truy vấn
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  // Thêm LIMIT và OFFSET
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  query += ` LIMIT ${limit} OFFSET ${offset}`;

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Lấy thông tin chi tiết một bài viết theo ID
router.get("/:id", authenticateToken, (req, res) => {
  const postId = req.params.id;

  // Kiểm tra phân quyền
  let fields = Fields.post(req.user.loaitaikhoan);

  // Xây dựng truy vấn SQL
  const query =
    "SELECT " + fields.join(", ") + " FROM BaiViet WHERE id_baiviet = ?";

  // Thực thi truy vấn
  connection.query(query, [postId], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.length === 0) {
      res.status(404).send("Post not found");
    } else {
      res.json(results[0]);
    }
  });
});

// Tạo mới một bài viết
router.post("/", authenticateToken, upload.single("img"), (req, res) => {
  // Chỉ Admin mới có quyền tạo bài viết
  if (req.user.loaitaikhoan !== "1") {
    return res.status(403).json({ error: "Not enough permission" });
  }

  const { id_sach, txt, tieude, trangthai } = req.body;

  // Kiểm tra dữ liệu
  if (!id_sach || !txt || !tieude) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO BaiViet (id_nguoidung, id_sach, img, ngaycapnhat, ngaytao, txt, tieude, trangthai)
    VALUES (?, ?, ?, NOW(), NOW(), ?, ?, ?)
  `;
  const queryParams = [
    req.user.id_nguoidung,
    id_sach,
    req.file ? req.file.path : null,
    txt,
    tieude,
    trangthai || "published",
  ];

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({
        message: "Post created successfully",
        postId: results.insertId,
      });
    }
  });
});

// Cập nhật thông tin bài viết
router.put("/:id", authenticateToken, upload.single("img"), (req, res) => {
  const postId = req.params.id;

  // Chỉ Admin mới có quyền cập nhật bài viết
  if (req.user.loaitaikhoan !== "1") {
    return res.status(403).json({ error: "Not enough permission" });
  }

  const { id_sach, txt, tieude, trangthai } = req.body;

  // Kiểm tra dữ liệu
  if (!id_sach || !txt || !tieude) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Xây dựng truy vấn SQL để cập nhật bài viết
  let query = `
    UPDATE BaiViet SET
      id_sach = ?, img = ?, ngaycapnhat = NOW(), txt = ?, tieude = ?, trangthai = ?
    WHERE id_baiviet = ?`;
  const queryParams = [
    id_sach,
    req.file ? req.file.path : null,
    txt,
    tieude,
    trangthai || "published",
    postId,
  ];

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Post not found" });
    } else {
      res.status(200).json({ message: "Post updated successfully" });
    }
  });
});

// Xóa một bài viết theo ID
router.delete("/:id", authenticateToken, (req, res) => {
  const postId = req.params.id;

  // Chỉ Admin mới có quyền xóa bài viết
  if (req.user.loaitaikhoan !== "1") {
    return res.status(403).json({ error: "Not enough permission" });
  }

  const query = "DELETE FROM BaiViet WHERE id_baiviet = ?";

  // Thực thi truy vấn
  connection.query(query, [postId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Post not found" });
    } else {
      res.status(200).json({ message: "Post deleted successfully" });
    }
  });
});

module.exports = router;
