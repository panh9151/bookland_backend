const express = require("express");
const NguoiDungModel = require("../models/NguoiDung/NguoiDungModel.js");
const DonHangModel = require("../models/DonHang/DonHangModel.js");
const BaiVietModel = require("../models/BaiViet/BaiVietModel.js");
const LuotTimModel = require("../models/LuotTim/LuotTimModel.js");
const BinhLuanModel = require("../models/BinhLuan/BinhLuanModel.js");
const DanhGiaModel = require("../models/DanhGia/DanhGiaModel.js");
const SachYeuThichModel = require("../models/SachYeuThich/SachYeuThichModel.js");

const routerNguoiDung = express.Router();

// Lấy danh sách người dùng bình thường
routerNguoiDung.get("/", async function (req, res, next) {
  try {
    const listNguoiDungs = await NguoiDungModel.find({ loaitaikhoan: 0 });
    res.json({ success: true, data: listNguoiDungs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Lấy thông tin một người dùng theo ID
routerNguoiDung.get("/:id", async function (req, res, next) {
  const { id } = req.params;

  try {
    const nguoiDung = await NguoiDungModel.findById(id);

    if (!nguoiDung || nguoiDung.loaitaikhoan !== 0) {
      return res.status(404).json({
        status: 0,
        message:
          "Người dùng không tồn tại hoặc không phải người dùng bình thường",
      });
    }

    res.json({ success: true, data: nguoiDung });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Thêm người dùng bình thường
routerNguoiDung.post("/", async function (req, res, next) {
  try {
    const { ten, matkhau, email, gioitinh, avt, sdt, id_gmail, loaitaikhoan } =
      req.body;

    if (loaitaikhoan !== 0) {
      return res
        .status(400)
        .json({ status: 0, message: "Loại tài khoản phải là người dùng" });
    }

    // Kiểm tra email, số điện thoại, ID Gmail đã tồn tại chưa
    const existingEmail = await NguoiDungModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ status: 0, message: "Email đã tồn tại" });
    }

    const existingSdt = await NguoiDungModel.findOne({ sdt });
    if (existingSdt) {
      return res
        .status(400)
        .json({ status: 0, message: "Số điện thoại đã tồn tại" });
    }

    const existingGmail = await NguoiDungModel.findOne({ id_gmail });
    if (existingGmail) {
      return res
        .status(400)
        .json({ status: 0, message: "ID Gmail đã tồn tại" });
    }

    const newNguoiDung = {
      ten,
      matkhau,
      email,
      gioitinh,
      avt,
      sdt,
      id_gmail,
      loaitaikhoan,
    };

    await NguoiDungModel.create(newNguoiDung);
    res.json({ status: 1, message: "Thêm người dùng thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm người dùng:", err);
    res.status(500).json({ status: 0, message: "Thêm người dùng thất bại" });
  }
});

// Sửa thông tin người dùng bình thường
routerNguoiDung.put("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const { ten, email, matkhau, sdt, id_gmail, trangthai } = req.body;

    const nguoiDung = await NguoiDungModel.findById(id);
    if (nguoiDung && nguoiDung.loaitaikhoan === 0) {
      // Kiểm tra email, số điện thoại, ID Gmail đã tồn tại chưa (ngoại trừ bản thân người dùng đang được cập nhật)
      const existingEmail = await NguoiDungModel.findOne({
        email,
        _id: { $ne: id },
      });
      if (existingEmail) {
        return res.status(400).json({ status: 0, message: "Email đã tồn tại" });
      }

      const existingSdt = await NguoiDungModel.findOne({
        sdt,
        _id: { $ne: id },
      });
      if (existingSdt) {
        return res
          .status(400)
          .json({ status: 0, message: "Số điện thoại đã tồn tại" });
      }

      const existingGmail = await NguoiDungModel.findOne({
        id_gmail,
        _id: { $ne: id },
      });
      if (existingGmail) {
        return res
          .status(400)
          .json({ status: 0, message: "ID Gmail đã tồn tại" });
      }

      // Nếu có đơn hàng, chỉ cho phép cập nhật trạng thái tài khoản
      const hasOrders = await DonHangModel.exists({ id_nguoidung: id });
      if (hasOrders) {
        await NguoiDungModel.findByIdAndUpdate(id, { id_hienthi: trangthai });
        res.json({
          status: 1,
          message: "Cập nhật trạng thái tài khoản thành công",
        });
      } else {
        await NguoiDungModel.findByIdAndUpdate(id, {
          ten,
          email,
          matkhau,
          sdt,
          id_gmail,
        });
        res.json({ status: 1, message: "Sửa người dùng thành công" });
      }
    } else {
      res.status(404).json({
        status: 0,
        message:
          "Người dùng không tồn tại hoặc không phải người dùng bình thường",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, message: "Sửa người dùng thất bại" });
  }
});

// Xóa người dùng bình thường
routerNguoiDung.delete("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;

    // Kiểm tra người dùng có tồn tại không và có phải là người dùng bình thường không
    const nguoiDung = await NguoiDungModel.findById(id);

    if (!nguoiDung || nguoiDung.loaitaikhoan !== 0) {
      return res.status(404).json({
        status: false,
        message:
          "Người dùng không tồn tại hoặc không phải người dùng bình thường",
      });
    }

    // Kiểm tra người dùng có đơn hàng không
    const hasOrders = await DonHangModel.exists({ id_nguoidung: id });
    if (hasOrders) {
      return res.status(400).json({
        status: false,
        message: "Người dùng đã có đơn hàng, không thể xóa",
      });
    }

    // Xóa bài viết của người dùng
    await BaiVietModel.updateMany(
      { id_nguoidung: id },
      { $set: { id_nguoidung: null } }
    );

    // Xóa các lượt tim của người dùng
    await LuotTimModel.deleteMany({ id_nguoidung: id });

    // Xóa các bình luận của người dùng
    await BinhLuanModel.deleteMany({ id_nguoidung: id });

    // Xóa các đánh giá của người dùng
    await DanhGiaModel.deleteMany({ id_nguoidung: id });

    // Xóa các dữ liệu trong bảng sách yêu thích của người dùng
    await SachYeuThichModel.deleteMany({ id_nguoidung: id });

    // Xóa người dùng
    await NguoiDungModel.deleteOne({ _id: id });

    res.json({ status: true, message: "Xóa người dùng thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    res.status(500).json({ status: false, message: "Xóa người dùng thất bại" });
  }
});

module.exports = routerNguoiDung;
