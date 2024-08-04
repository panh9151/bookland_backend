const express = require("express");
const router = express.Router();
const connection = require("../config/connection");
const authenticateToken = require("../config/auth");
const upload = require("../config/upload");
const Checker = require("../classes/Checker");
const Fields = require("../classes/Fields");

// Lấy tất cả các banner
router.get("/", authenticateToken, (req, res) => {
  // Kiểm tra phân quyền
  let fields = Fields.banner(req.user.loaitaikhoan);

  let query = "SELECT " + fields.join(", ") + " FROM Banner";
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

// Lấy thông tin chi tiết một banner theo ID
router.get("/:id", authenticateToken, (req, res) => {
  const bannerId = req.params.id;

  // Kiểm tra phân quyền
  let fields = Fields.banner(req.user.loaitaikhoan);

  // Xây dựng truy vấn SQL
  const query =
    "SELECT " + fields.join(", ") + " FROM Banner WHERE id_banner = ?";

  // Thực thi truy vấn
  connection.query(query, [bannerId], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.length === 0) {
      res.status(404).send("Banner not found");
    } else {
      res.json(results[0]);
    }
  });
});

// Tạo mới một banner
router.post("/", authenticateToken, upload.single("img"), (req, res) => {
  // Chỉ Admin mới có quyền tạo banner
  if (req.user.loaitaikhoan !== "1") {
    return res.status(403).json({ error: "Not enough permission" });
  }

  const { link_to, mobile_img, ngaybatdau, ngayketthuc, uutien, hienthi } =
    req.body;

  // Kiểm tra dữ liệu
  if (!link_to || !uutien) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const isLinkToValid = Checker.checkBoolean(link_to) || true;
  const isPriorityValid = Checker.checkBoolean(uutien) || true;
  const isDisplayStatusValid = Checker.checkBoolean(hienthi) || true;

  if (
    typeof isLinkToValid === "string" ||
    typeof isPriorityValid === "string" ||
    typeof isDisplayStatusValid === "string"
  ) {
    return res.status(400).json({
      error: isLinkToValid || isPriorityValid || isDisplayStatusValid,
    });
  }

  const query = `
    INSERT INTO Banner (link_to, img, mobile_img, ngaybatdau, ngayketthuc, uutien, hienthi)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const queryParams = [
    link_to,
    req.file ? req.file.path : null,
    mobile_img,
    ngaybatdau,
    ngayketthuc,
    uutien,
    hienthi || true,
  ];

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({
        message: "Banner created successfully",
        bannerId: results.insertId,
      });
    }
  });
});

// Cập nhật thông tin banner
router.put("/:id", authenticateToken, upload.single("img"), (req, res) => {
  const bannerId = req.params.id;

  // Chỉ Admin mới có quyền cập nhật banner
  if (req.user.loaitaikhoan !== "1") {
    return res.status(403).json({ error: "Not enough permission" });
  }

  const { link_to, mobile_img, ngaybatdau, ngayketthuc, uutien, hienthi } =
    req.body;

  // Kiểm tra dữ liệu
  if (!link_to || !uutien) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const isLinkToValid = Checker.checkBoolean(link_to) || true;
  const isPriorityValid = Checker.checkBoolean(uutien) || true;
  const isDisplayStatusValid = Checker.checkBoolean(hienthi) || true;

  if (
    typeof isLinkToValid === "string" ||
    typeof isPriorityValid === "string" ||
    typeof isDisplayStatusValid === "string"
  ) {
    return res.status(400).json({
      error: isLinkToValid || isPriorityValid || isDisplayStatusValid,
    });
  }

  // Xây dựng truy vấn SQL để cập nhật banner
  let query = `
    UPDATE Banner SET
      link_to = ?, img = ?, mobile_img = ?, ngaybatdau = ?, ngayketthuc = ?, uutien = ?, hienthi = ?
    WHERE id_banner = ?`;
  const queryParams = [
    link_to,
    req.file ? req.file.path : null,
    mobile_img,
    ngaybatdau,
    ngayketthuc,
    uutien,
    hienthi,
    bannerId,
  ];

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Banner not found" });
    } else {
      res.status(200).json({ message: "Banner updated successfully" });
    }
  });
});

// Xóa một banner theo ID
router.delete("/:id", authenticateToken, (req, res) => {
  const bannerId = req.params.id;

  // Chỉ Admin mới có quyền xóa banner
  if (req.user.loaitaikhoan !== "1") {
    return res.status(403).json({ error: "Not enough permission" });
  }

  const query = "DELETE FROM Banner WHERE id_banner = ?";

  // Thực thi truy vấn
  connection.query(query, [bannerId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Banner not found" });
    } else {
      res.status(200).json({ message: "Banner deleted successfully" });
    }
  });
});

module.exports = router;
