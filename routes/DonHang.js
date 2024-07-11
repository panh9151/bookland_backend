import express from "express";
import DonHangModel from "../models/DonHang/DonHangModel.js";

const routerDonHang = express.Router();

// Tạo đơn hàng mới
routerDonHang.post("/add", async (req, res) => {
  const {
    id_nguoidung,
    diachi,
    sdt,
    nguoinhan,
    phuongthucthanhtoan,
    ghichu,
    ngaydathang,
    status,
    thanhtoan,
  } = req.body;
  try {
    const newDonHang = new DonHangModel({
      id_nguoidung,
      diachi,
      sdt,
      nguoinhan,
      phuongthucthanhtoan,
      ghichu,
      ngaydathang,
      status,
      thanhtoan,
    });
    await newDonHang.save();
    res.status(201).json(newDonHang);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cập nhật trạng thái đơn hàng
routerDonHang.put("/status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedDonHang = await DonHangModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedDonHang) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }
    res.status(200).json(updatedDonHang);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lấy thông tin đơn hàng
routerDonHang.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const DonHang = await DonHangModel.findById(id);
    if (!DonHang) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }
    res.status(200).json(DonHang);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lấy danh sách tất cả đơn hàng
routerDonHang.get("/list", async (req, res) => {
  try {
    const DonHangs = await DonHangModel.find();
    res.status(200).json(DonHangs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default routerDonHang;
