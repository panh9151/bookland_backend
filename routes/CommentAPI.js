const express = require("express");
const router = express.Router();
const connection = require("../config/connection");
const authenticateToken = require("../config/auth");
const Checker = require("../classes/Checker");
const Fields = require("../classes/Fields");

// Lấy danh sách bình luận
router.get("/", authenticateToken, (req, res) => {
  let fields = Fields.comment(req.user.loaitaikhoan);

  let query = "SELECT " + fields.join(", ") + " FROM BinhLuan";
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

// Lấy thông tin chi tiết một bình luận theo ID
router.get("/:id", authenticateToken, (req, res) => {
  const commentId = req.params.id;

  // Kiểm tra phân quyền
  let fields = Fields.comment(req.user.loaitaikhoan);

  // Xây dựng truy vấn SQL
  const query =
    "SELECT " + fields.join(", ") + " FROM BinhLuan WHERE id_binhluan = ?";

  // Thực thi truy vấn
  connection.query(query, [commentId], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.length === 0) {
      res.status(404).send("Comment not found");
    } else {
      res.json(results[0]);
    }
  });
});

// Tạo mới một bình luận
router.post("/", authenticateToken, (req, res) => {
  const { id_baiviet, txt } = req.body;

  // Kiểm tra dữ liệu
  if (!id_baiviet || !txt) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO BinhLuan (id_nguoidung, id_baiviet, txt, thoigiantao)
    VALUES (?, ?, ?, NOW())
  `;
  const queryParams = [req.user.id_nguoidung, id_baiviet, txt];

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({
        message: "Comment created successfully",
        commentId: results.insertId,
      });
    }
  });
});

// Cập nhật thông tin bình luận
router.put("/:id", authenticateToken, (req, res) => {
  const commentId = req.params.id;
  const { txt } = req.body;

  // Kiểm tra dữ liệu
  if (!txt) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Xác minh quyền sở hữu bình luận
  connection.query(
    "SELECT id_nguoidung FROM BinhLuan WHERE id_binhluan = ?",
    [commentId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else if (results.length === 0) {
        return res.status(404).json({ error: "Comment not found" });
      }

      const commentOwnerId = results[0].id_nguoidung;
      if (
        req.user.id_nguoidung !== commentOwnerId &&
        req.user.loaitaikhoan !== "1"
      ) {
        return res.status(403).json({ error: "Not enough permission" });
      }

      const query = "UPDATE BinhLuan SET txt = ? WHERE id_binhluan = ?";
      const queryParams = [txt, commentId];

      // Thực thi truy vấn
      connection.query(query, queryParams, (err, results) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else if (results.affectedRows === 0) {
          res.status(404).json({ error: "Comment not found" });
        } else {
          res.status(200).json({ message: "Comment updated successfully" });
        }
      });
    }
  );
});

// Xóa một bình luận theo ID
router.delete("/:id", authenticateToken, (req, res) => {
  const commentId = req.params.id;

  // Xác minh quyền sở hữu bình luận
  connection.query(
    "SELECT id_nguoidung FROM BinhLuan WHERE id_binhluan = ?",
    [commentId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else if (results.length === 0) {
        return res.status(404).json({ error: "Comment not found" });
      }

      const commentOwnerId = results[0].id_nguoidung;
      if (
        req.user.id_nguoidung !== commentOwnerId &&
        req.user.loaitaikhoan !== "1"
      ) {
        return res.status(403).json({ error: "Not enough permission" });
      }

      const query = "DELETE FROM BinhLuan WHERE id_binhluan = ?";

      // Thực thi truy vấn
      connection.query(query, [commentId], (err, results) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else if (results.affectedRows === 0) {
          res.status(404).json({ error: "Comment not found" });
        } else {
          res.status(200).json({ message: "Comment deleted successfully" });
        }
      });
    }
  );
});

module.exports = router;
