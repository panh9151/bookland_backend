import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import NguoiDungModel from "../models/NguoiDung/NguoiDungModel.js"; // Giả sử NguoiDungModel được xuất đúng từ tệp này
const routerAuth = express.Router();

routerAuth.post("/login", async (req, res) => {
  const { email, matkhau } = req.body;

  try {
    // Tìm người dùng bằng email
    const NguoiDung = await NguoiDungModel.findOne({ email });
    if (!NguoiDung) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(matkhau, NguoiDung.matkhau);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // Sinh token JWT
    const token = jwt.sign(
      { NguoiDungId: NguoiDung._id, loaitaikhoan: NguoiDung.loaitaikhoan },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default routerAuth;
