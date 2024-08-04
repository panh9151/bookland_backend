const express = require("express");
const router = express.Router();
const connection = require("../config/connection");
const authenticateToken = require("../config/auth");
const bcrypt = require("bcryptjs"); // Thêm bcrypt để mã hóa mật khẩu
const { v4: uuidv4 } = require("uuid");
const upload = require("../config/upload");
const Checker = require("../classes/Checker");
const Fields = require("../classes/Fields");

// Lấy tất cả người dùng
router.get("/", authenticateToken, (req, res) => {
  // Kiểm tra phân quyền
  if (req.user.loaitaikhoan !== "1") {
    return res.status(403).send("Not enough permission"); // Trả về lỗi nếu không phải admin
  }

  // Lấy offset và limit từ query params
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit);

  // Xây dựng truy vấn SQL
  let fields;
  fields = Fields.user(req.user.loaitaikhoan);
  let query = "SELECT " + fields.join(", ") + " FROM NguoiDung";
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

// Lấy một người dùng theo ID
router.get("/:id", authenticateToken, (req, res) => {
  const userId = req.params.id;

  // Check role người dùng
  if (req.user.loaitaikhoan)
    return res.status(403).json({ message: "Not enough permission" });

  // Xây dựng truy vấn SQL
  fields = Fields.user(req.user.loaitaikhoan);
  const query =
    "SELECT " +
    fields.filter((item) => item !== "").join(", ") +
    " FROM NguoiDung WHERE id_nguoidung = ?";

  // Thực thi truy vấn
  connection.query(query, [userId], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.length === 0) {
      res.status(404).send("User not found"); // Trả về lỗi nếu không tìm thấy người dùng
    } else {
      res.json(results[0]); // Trả về thông tin người dùng
    }
  });
});

// Thêm một người dùng mới
router.post("/", authenticateToken, upload.single("avt"), async (req, res) => {
  const {
    email,
    matkhau,
    ten,
    gioitinh,
    avt,
    ngaysinh,
    sdt,
    hienthi = true,
    loaitaikhoan,
  } = req.body;

  // Kiểm tra xem các trường bắt buộc đều có giá trị
  if (!email || !matkhau || !ten) {
    return res.status(400).json({ error: "Missing validation fields" });
  }

  const isPasswordValid =
    (req.body.matkhau && Checker.checkPassword(matkhau)) || true;
  const isEmailValid = (req.body.email && Checker.checkEmail(email)) || true;
  const isPhoneNumberValid =
    (req.body.sdt && Checker.checkPhoneNumber(sdt)) || true;
  const isGenderValid =
    (req.body.gioitinh && Checker.checkGender(gioitinh)) || true;
  const isDateValid =
    (req.body.ngaysinh && Checker.checkDate(ngaysinh)) || true;
  const isDisplayStatusValid =
    (req.body.hienthi && Checker.checkDisplayStatus(hienthi)) || true;

  if (
    typeof isPasswordValid === "string" ||
    typeof isEmailValid === "string" ||
    typeof isPhoneNumberValid === "string" ||
    typeof isGenderValid === "string" ||
    typeof isDateValid === "string" ||
    typeof isDisplayStatusValid === "string"
  ) {
    return res.status(400).json({
      error:
        isPasswordValid ||
        isEmailValid ||
        isPhoneNumberValid ||
        isGenderValid ||
        isDateValid ||
        isDisplayStatusValid,
    });
  }

  // Xác định loại tài khoản
  let userAccountType = req.user.loaitaikhoan;
  if (
    userAccountType !== "1" &&
    loaitaikhoan !== undefined &&
    loaitaikhoan !== "0"
  ) {
    return res.status(403).json({ error: "Not enough permission" });
  }
  const newAccountType = userAccountType === "1" ? loaitaikhoan || "0" : "0";

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10);
  hashedPassword = await bcrypt.hash(matkhau, salt);

  // Tạo id_nguoidung và ngày tạo mới
  const id_nguoidung = uuidv4(); // Sử dụng uuid để tạo id_nguoidung duy nhất
  const ngaytao = new Date();

  // Các trường không bắt buộc
  const { id_google = null } = req.body;

  // Xây dựng truy vấn SQL để thêm người dùng
  const query = `
    INSERT INTO NguoiDung (
      id_nguoidung, loaitaikhoan, id_google, matkhau, email, ten, gioitinh, avt, ngaysinh, sdt, ngaytao, hienthi
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const queryParams = [
    id_nguoidung,
    newAccountType,
    id_google,
    hashedPassword,
    email,
    ten,
    gioitinh,
    req.file ? req.file.path : null,
    ngaysinh,
    sdt,
    ngaytao,
    hienthi,
  ];

  // Thực thi truy vấn
  connection.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res
        .status(201)
        .json({ message: "User created successfully", userId: id_nguoidung });
    }
  });
});

// Cập nhật thông tin người dùng
router.put(
  "/:id",
  authenticateToken,
  upload.single("avt"),
  async (req, res) => {
    const userId = req.params.id;
    const {
      email,
      matkhau,
      ten,
      gioitinh,
      avt,
      ngaysinh,
      sdt,
      hienthi,
      loaitaikhoan,
    } = req.body;

    // Body không có thì không xử lý
    // if (Checker.isEmptyObject(req.body))
    //   return res.status(400).json({ error: "Body not found" });

    // Validation
    const isPasswordValid =
      (req.body.matkhau && Checker.checkPassword(matkhau)) || true;
    const isEmailValid = (req.body.email && Checker.checkEmail(email)) || true;
    const isPhoneNumberValid =
      (req.body.sdt && Checker.checkPhoneNumber(sdt)) || true;
    const isGenderValid =
      (req.body.gioitinh && Checker.checkGender(gioitinh)) || true;
    const isDateValid =
      (req.body.ngaysinh && Checker.checkDate(ngaysinh)) || true;
    const isDisplayStatusValid =
      (req.body.hienthi && Checker.checkDisplayStatus(hienthi)) || true;

    if (
      typeof isPasswordValid === "string" ||
      typeof isEmailValid === "string" ||
      typeof isPhoneNumberValid === "string" ||
      typeof isGenderValid === "string" ||
      typeof isDateValid === "string" ||
      typeof isDisplayStatusValid === "string"
    ) {
      return res.status(400).json({
        error:
          isPasswordValid ||
          isEmailValid ||
          isPhoneNumberValid ||
          isGenderValid ||
          isDateValid ||
          isDisplayStatusValid,
      });
    }

    // Kiểm tra loại tài khoản
    let userAccountType = req.user.loaitaikhoan;
    if (
      userAccountType !== "1" &&
      loaitaikhoan !== undefined &&
      loaitaikhoan !== "0"
    ) {
      return res
        .status(403)
        .json({ error: "Not enough permission to set account type" });
    }

    // Mã hóa mật khẩu nếu có thay đổi
    let hashedPassword = null;
    if (matkhau) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(matkhau, salt);
    }

    // Xây dựng truy vấn SQL để cập nhật người dùng
    let query =
      `
        UPDATE NguoiDung SET
          email = ?, ten = ?, gioitinh = ?, avt = ?, ngaysinh = ?, sdt = ?, hienthi = ?` +
      (hashedPassword ? `, matkhau = ?` : ``) +
      (loaitaikhoan !== undefined ? `, loaitaikhoan = ?` : ``) +
      ` WHERE id_nguoidung = ?`;
    let queryParams = [
      email,
      ten,
      gioitinh,
      req.file ? req.file.path : null,
      // process.env.CLOUD_URL + process.env.CLOUD_FOLDER + "/" + req.avt,
      ngaysinh,
      sdt,
      hienthi,
      ...(hashedPassword ? [hashedPassword] : []),
      ...(loaitaikhoan !== undefined ? [loaitaikhoan] : []),
      userId,
    ];

    // Thực thi truy vấn
    connection.query(query, queryParams, (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        // cloudinary.uploader.destroy(req.user.avt);

        fields = Fields.user(req.user.loaitaikhoan);
        const userQuery =
          "SELECT " +
          fields.filter((item) => item !== "").join(", ") +
          " FROM NguoiDung WHERE id_nguoidung = ?";
        connection.query(userQuery, [userId], (error, results) => {
          res.status(200).json({
            updatedData: { newData: results[0] },
            message: "User updated successfully",
          });
        });
      }
    });
  }
);

// Xóa một người dùng theo ID
router.delete("/:id", authenticateToken, (req, res) => {
  const userId = req.params.id;

  // Kiểm tra quyền truy cập
  let role = req.user.loaitaikhoan;
  if (role !== "1") {
    return res.status(403).json({ error: "Not enough permission" });
  }

  // Xây dựng truy vấn SQL để xóa người dùng
  const query = `
    DELETE FROM NguoiDung WHERE id_nguoidung = ?`;

  // Thực thi truy vấn
  connection.query(query, [userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.status(200).json({ message: "User deleted successfully" });
      }
    }
  });
});

module.exports = router;
