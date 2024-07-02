import express from "express";
import UserModel from "../models/User/userModel.js";

const routerUser = express.Router();
const routerAdmin = express.Router();

// Kiểm tra tài khoản trùng lặp
routerUser.post("/check-duplicate", async (req, res, next) => {
  try {
    const { ten } = req.body;
    const existingUser = await UserModel.findOne({ ten });
    if (existingUser) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    return next(error);
  }
});

// Lấy danh sách người dùng bình thường
routerUser.get("/list", async function (req, res, next) {
  try {
    const listUsers = await UserModel.find({ loaitaikhoan: 0 });
    res.json({ success: true, data: listUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Thêm người dùng bình thường
routerUser.post("/add", async function (req, res, next) {
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

    if (loaitaikhoan == 0) {
      return res
        .status(400)
        .json({ status: 0, message: "Loại tài khoản phải là người dùng" });
    }

    const newUser = {
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

    await UserModel.create(newUser);
    res.json({ status: 1, message: "Thêm người dùng thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm người dùng:", err);
    res.json({ status: 0, message: "Thêm người dùng thất bại" });
  }
});

// Sửa thông tin người dùng bình thường
routerUser.put("/edit", async function (req, res, next) {
  try {
    const { id_user, ten, email, password } = req.body;
    var user = await UserModel.findById(id_user);
    if (user && user.loaitaikhoan === 0) {
      await UserModel.findByIdAndUpdate(id_user, { ten, email, password });
      res.json({ status: 1, message: "Sửa người dùng thành công" });
    } else {
      res.status(404).json({
        status: 0,
        message:
          "Người dùng không tồn tại hoặc không phải người dùng bình thường",
      });
    }
  } catch (err) {
    res.json({ status: 0, message: "Sửa người dùng thất bại" });
  }
});

// Xóa người dùng bình thường
routerUser.delete("/:ten", async function (req, res, next) {
  try {
    let { ten } = req.params;
    const user = await UserModel.findOne({ ten });
    if (user && user.loaitaikhoan === 0) {
      await UserModel.deleteOne({ ten });
      res.json({ status: true });
    } else {
      res.status(404).json({
        status: false,
        message:
          "Người dùng không tồn tại hoặc không phải người dùng bình thường",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "Xóa người dùng thất bại" });
  }
});

// Các router tương tự cho Admin (loaitaikhoan: 1)
routerAdmin.get("/list", async function (req, res, next) {
  try {
    const listAdmins = await UserModel.find({ loaitaikhoan: 1 });
    res.json({ success: true, data: listAdmins });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

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

    if (loaitaikhoan == 1) {
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

routerAdmin.put("/edit", async function (req, res, next) {
  try {
    const { id_user, ten, email, password } = req.body;
    var user = await UserModel.findById(id_user);
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

export { routerUser, routerAdmin };
