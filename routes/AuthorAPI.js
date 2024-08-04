const express = require("express");
const router = express.Router();
const connection = require("../config/connection");
const authenticateToken = require("../config/auth");
const bcrypt = require("bcryptjs"); // Thêm bcrypt để mã hóa mật khẩu
const { v4: uuidv4 } = require("uuid");
const upload = require("../config/upload");
const Checker = require("../classes/Checker");
const Fields = require("../classes/Fields");
const dotenv = require("dotenv");

// Lấy tất cả tác giả
router.get("/", authenticateToken, (req, res) => {
  // Lấy offset và limit từ query params
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit);

  // Xây dựng truy vấn SQL
  let fields;
  fields = Fields.author(req.user.loaitaikhoan);
  let query = "SELECT " + fields.join(", ") + " FROM TacGia";
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
  if (limit) {
    query += ` LIMIT ${limit}`;
    if (offset) {
      query += ` OFFSET ${offset}`;
    }
  }

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Lấy một tác giả theo ID
router.get("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  // Xác định loại tài khoản
  const userAccountType = req.user.loaitaikhoan;

  // Xây dựng truy vấn SQL
  let fields;
  fields = Fields.author(userAccountType);
  const query = `SELECT ${fields.join(", ")} FROM TacGia WHERE id_tacgia = ?`;
  const queryParams = [id];

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.length === 0) {
      res.status(404).json({ error: "Author not found" });
    } else {
      res.json(results[0]);
    }
  });
});

// Thêm một tác giả mới
router.post("/", authenticateToken, upload.single("img"), async (req, res) => {
  const { ten, img, txt, hienthi } = req.body;

  // Kiểm tra xem các trường bắt buộc đều có giá trị
  if (!ten) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Xác định loại tài khoản
  userAccountType = req.user.loaitaikhoan;
  if (userAccountType !== "1")
    return res.status(403).json({ error: "Not enough permission" });

  // Chỉ admin mới có quyền đặt trường 'hienthi'
  let displayStatus = true; // Mặc định là true
  if (userAccountType === "1" && hienthi !== undefined) {
    const isDisplayStatusValid = Checker.checkDisplayStatus(hienthi);
    if (typeof isDisplayStatusValid === "string") {
      return res.status(400).json({
        error: isDisplayStatusValid,
      });
    }
    displayStatus = hienthi;
  }

  // Tạo id_tacgia mới
  const id_tacgia_new = uuidv4();

  // Xây dựng truy vấn SQL để thêm tác giả
  const query = `
    INSERT INTO TacGia (
      id_tacgia, ten, img, txt, hienthi
    ) VALUES (?, ?, ?, ?, ?)`;
  const queryParams = [
    id_tacgia_new,
    ten,
    req.file ? req.file.path : null,
    txt,
    displayStatus,
  ];

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({
        message: "Author created successfully",
        authorId: id_tacgia_new,
      });
    }
  });
});

// Cập nhật thông tin tác giả
router.put(
  "/:id",
  authenticateToken,
  upload.single("img"),
  async (req, res) => {
    const { id } = req.params; // ID của tác giả cần cập nhật
    const { ten, img, txt, hienthi } = req.body;

    // Kiểm tra xem các trường bắt buộc đều có giá trị
    if (!ten) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Xác định loại tài khoản
    userAccountType = req.user.loaitaikhoan;
    if (userAccountType !== "1")
      return res.status(403).json({ error: "Not enough permission" });

    // Chỉ admin mới có quyền đặt trường 'hienthi'
    let displayStatus = null; // Mặc định là null nếu không cập nhật
    if (userAccountType === "1" && hienthi !== undefined) {
      const isDisplayStatusValid = Checker.checkDisplayStatus(hienthi);
      if (typeof isDisplayStatusValid === "string") {
        return res.status(400).json({
          error: isDisplayStatusValid,
        });
      }
      displayStatus = hienthi;
    }

    // Xây dựng truy vấn SQL để cập nhật thông tin tác giả
    const query = `
    UPDATE TacGia SET
      ten = ?,
      img = ?,
      txt = ?,
      hienthi = ?
    WHERE id_tacgia = ?`;
    const queryParams = [
      ten,
      req.file ? req.file.path : null,
      txt,
      displayStatus,
      id,
    ];

    // Thực thi truy vấn
    connection.query(query, queryParams, (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: "Author not found" });
      } else {
        res.status(200).json({
          message: "Author updated successfully",
        });
      }
    });
  }
);

// Xóa một tác giả theo ID
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  // Xác định loại tài khoản
  const userAccountType = req.user.loaitaikhoan;

  // Chỉ cho phép admin xóa tác giả
  if (userAccountType !== "1") {
    return res.status(403).json({ error: "Not enough permission" });
  }

  // Xây dựng truy vấn SQL để xóa tác giả
  const query = "DELETE FROM TacGia WHERE id_tacgia = ?";
  const queryParams = [id];

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Author not found" });
    } else {
      res.status(200).json({ message: "Author deleted successfully" });
    }
  });
});

module.exports = router;
