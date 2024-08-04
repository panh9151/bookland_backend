const express = require("express");
const router = express.Router();
const connection = require("../config/connection");
const authenticateToken = require("../config/auth");
const upload = require("../config/upload");
const Checker = require("../classes/Checker");
const Fields = require("../classes/Fields");

// Lấy danh sách tất cả sách
router.get("/", authenticateToken, (req, res) => {
  let fields = Fields.book(req.user.loaitaikhoan);

  let query = "SELECT " + fields.join(", ") + " FROM Sach";
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

// Lấy thông tin chi tiết một sách theo ID
router.get("/:id", authenticateToken, (req, res) => {
  const bookId = req.params.id;

  // Kiểm tra phân quyền
  let fields = Fields.book(req.user.loaitaikhoan);

  // Xây dựng truy vấn SQL
  const query = "SELECT " + fields.join(", ") + " FROM Sach WHERE id_sach = ?";

  // Thực thi truy vấn
  connection.query(query, [bookId], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.length === 0) {
      res.status(404).send("Book not found");
    } else {
      res.json(results[0]);
    }
  });
});

// Tạo mới một sách
router.post("/", authenticateToken, upload.single("img"), (req, res) => {
  // Chỉ Admin mới có quyền tạo sách
  if (req.user.loaitaikhoan !== "1") {
    return res.status(403).json({ error: "Not enough permission" });
  }

  const {
    id_tacgia,
    ten,
    nxb,
    mota,
    namxuatban,
    gia,
    giamgia,
    giacu,
    ngonngu,
    hienthi,
  } = req.body;

  // Kiểm tra dữ liệu
  if (!id_tacgia || !ten || !nxb || !namxuatban || !gia || !ngonngu) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO Sach (id_tacgia, ten, nxb, img, mota, namxuatban, ngaytao, gia, giamgia, giacu, ngonngu, hienthi)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)
  `;
  const queryParams = [
    id_tacgia,
    ten,
    nxb,
    req.file ? req.file.path : null,
    mota || null,
    namxuatban,
    gia,
    giamgia || null,
    giacu || null,
    ngonngu,
    hienthi || 1,
  ];

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({
        message: "Book created successfully",
        bookId: results.insertId,
      });
    }
  });
});

// Cập nhật thông tin sách
router.put("/:id", authenticateToken, upload.single("img"), (req, res) => {
  const bookId = req.params.id;

  // Chỉ Admin mới có quyền cập nhật sách
  if (req.user.loaitaikhoan !== "1") {
    return res.status(403).json({ error: "Not enough permission" });
  }

  const {
    id_tacgia,
    ten,
    nxb,
    mota,
    namxuatban,
    gia,
    giamgia,
    giacu,
    ngonngu,
    hienthi,
  } = req.body;

  // Kiểm tra dữ liệu
  if (!id_tacgia || !ten || !nxb || !namxuatban || !gia || !ngonngu) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Xây dựng truy vấn SQL để cập nhật sách
  let query = `
    UPDATE Sach SET
      id_tacgia = ?, ten = ?, nxb = ?, img = ?, mota = ?, namxuatban = ?, gia = ?, giamgia = ?, giacu = ?, ngonngu = ?, hienthi = ?
    WHERE id_sach = ?`;
  const queryParams = [
    id_tacgia,
    ten,
    nxb,
    req.file ? req.file.path : null,
    mota || null,
    namxuatban,
    gia,
    giamgia || null,
    giacu || null,
    ngonngu,
    hienthi || 1,
    bookId,
  ];

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Book not found" });
    } else {
      res.status(200).json({ message: "Book updated successfully" });
    }
  });
});

// Xóa một sách theo ID
router.delete("/:id", authenticateToken, (req, res) => {
  const bookId = req.params.id;

  // Chỉ Admin mới có quyền xóa sách
  if (req.user.loaitaikhoan !== "1") {
    return res.status(403).json({ error: "Not enough permission" });
  }

  const query = "DELETE FROM Sach WHERE id_sach = ?";

  // Thực thi truy vấn
  connection.query(query, [bookId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Book not found" });
    } else {
      res.status(200).json({ message: "Book deleted successfully" });
    }
  });
});

module.exports = router;
