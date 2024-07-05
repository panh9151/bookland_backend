import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/User/userModel.js";
const routerAuth = express.Router();

routerAuth.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const UserModel = await UserModel.findOne({ email });
    if (!UserModel) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, UserModel.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      { UserModelId: UserModel._id, loaitaikhoan: UserModel.loaitaikhoan },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

routerAuth.post("/logout", (req, res) => {
  res.status(200).json({ message: "Đăng xuất thành công" });
});

export default routerAuth;
