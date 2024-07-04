import express from "express";
import UserModel from "../models/User/userModel.js";

const routerUser = express.Router();

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

    if (loaitaikhoan !== 0) {
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
routerUser.delete("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user || user.loaitaikhoan !== 0) {
      return res.status(404).json({
        status: false,
        message:
          "Người dùng không tồn tại hoặc không phải người dùng bình thường",
      });
    }

    await UserModel.deleteOne({ _id: id });
    res.json({ status: true, message: "Xóa người dùng thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    res.json({ status: false, message: "Xóa người dùng thất bại" });
  }
});

export default routerUser;
