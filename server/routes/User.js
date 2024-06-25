import express from "express";
import UserModel from "../models/User/userModel.js";

const routerUser = express.Router();

routerUser.post("/check-duplicate", async (req, res, next) => {
  try {
    const { username } = req.body;

    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    return next(error);
  }
});

routerUser.get("/list", async function (req, res, next) {
  try {
    const listUsers = await UserModel.find({});
    res.json({ success: true, data: listUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

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

    if (!loaitaikhoan) {
      return res
        .status(400)
        .json({ status: 0, message: "Loại tài khoản là bắt buộc" });
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
      loaitaikhoan, // Đảm bảo cung cấp giá trị cho trường loaitaikhoan
    };

    await UserModel.create(newUser);

    res.json({ status: 1, message: "Thêm người dùng thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm người dùng:", err);
    res.json({ status: 0, message: "Thêm người dùng thất bại" });
  }
});

routerUser.put("/edit", async function (req, res, next) {
  try {
    const { id_user, username, email, password } = req.body;
    var user = await UserModel.findById(id_user);
    console.log(user);
    if (user) {
      const updatedUser = await UserModel.findByIdAndUpdate(id_user, {
        username,
        email,
        password,
      });
      res.json({ status: 1, message: "Sửa người dùng thành công" });
    }
  } catch (err) {
    res.json({ status: 0, message: "Sửa người dùng thất bại" });
  }
});

routerUser.delete("/:username", async function (req, res, next) {
  try {
    let { username } = req.params;
    await UserModel.deleteOne({ username: username });
    res.json({ status: true });
  } catch (error) {
    console.log(error);
    res.json({ status: false });
  }
});

export default routerUser;
