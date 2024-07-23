const express = require("express");
const mongoose = require("mongoose");
const DonHangModel = require("../models/DonHang/DonHangModel.js");

const routerDonHang = express.Router();

// Tạo đơn hàng mới
routerDonHang.post("/", async (req, res) => {
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

    const savedDonHang = await newDonHang.save();
    res.status(201).json(savedDonHang);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cập nhật trạng thái đơn hàng
routerDonHang.put("/status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
  }

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

// Xóa đơn hàng
routerDonHang.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
  }

  try {
    const deletedDonHang = await DonHangModel.findByIdAndDelete(id);

    if (!deletedDonHang) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.status(200).json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lấy danh sách đơn hàng
routerDonHang.get("/", async (req, res) => {
  try {
    const listDonHang = await DonHangModel.find();
    res.status(200).json(listDonHang);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lấy thông tin một đơn hàng theo ID
routerDonHang.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID đơn hàng không hợp lệ" });
  }

  try {
    const donHang = await DonHangModel.findById(id);

    if (!donHang) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.status(200).json(donHang);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = routerDonHang;
