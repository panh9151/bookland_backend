import express from "express";
import UserModel from "../models/User/userModel.js";

const routerAdmin = express.Router();

// Lấy danh sách admin
routerAdmin.get("/list", async function (req, res, next) {
  try {
    const listAdmins = await UserModel.find({ loaitaikhoan: 1 });
    res.json({ success: true, data: listAdmins });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Thêm admin
routerAdmin.post("/add", async function (req, res, next) {
  try {
    const {
      id_user,
      ten,
      password,
      email,
      gioitinh,
      avt,
      sdt,
      ngaytao,
      loaitaikhoan,
    } = req.body;

    if (loaitaikhoan !== 1) {
      return res
        .status(400)
        .json({ status: 0, message: "Loại tài khoản phải là admin" });
    }

    const newAdmin = {
      id_user,
      ten,
      password,
      email,
      gioitinh,
      avt,
      sdt,
      ngaytao,
      loaitaikhoan,
    };

    await UserModel.create(newAdmin);
    res.json({ status: 1, message: "Thêm admin thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm admin:", err);
    res.json({ status: 0, message: "Thêm admin thất bại" });
  }
});

// Sửa thông tin admin
routerAdmin.put("/edit", async function (req, res, next) {
  try {
    const { id_user, ten, email, password } = req.body;
    const user = await UserModel.findById(id_user);
    if (user && user.loaitaikhoan === 1) {
      await UserModel.findByIdAndUpdate(id_user, { ten, email, password });
      res.json({ status: 1, message: "Sửa admin thành công" });
    } else {
      res.status(404).json({
        status: 0,
        message: "Admin không tồn tại hoặc không phải admin",
      });
    }
  } catch (err) {
    res.json({ status: 0, message: "Sửa admin thất bại" });
  }
});

// Xóa admin
routerAdmin.delete("/:ten", async function (req, res, next) {
  try {
    let { ten } = req.params;
    const user = await UserModel.findOne({ ten });
    if (user && user.loaitaikhoan === 1) {
      await UserModel.deleteOne({ ten });
      res.json({ status: true });
    } else {
      res.status(404).json({
        status: false,
        message: "Admin không tồn tại hoặc không phải admin",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "Xóa admin thất bại" });
  }
});

export default routerAdmin;
