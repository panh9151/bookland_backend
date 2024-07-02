import express from "express";
import VoucherModel from "../models/Voucher/VoucherModel.js";

const routerVoucher = express.Router();

// Route để thêm một Voucher mới
routerVoucher.post("/add", async (req, res, next) => {
  try {
    const { Code, Mota, Giagiam, Ngayhethan } = req.body;
    const newVoucher = new VoucherModel({
      Code,
      Mota,
      Giagiam,
      Ngayhethan,
      Ngaytao: Date.now(),
      Ngaycapnhat: Date.now(),
    });
    const savedVoucher = await newVoucher.save();
    res.status(201).json(savedVoucher);
  } catch (error) {
    next(error);
  }
});

// Route để lấy danh sách các Voucher
routerVoucher.get("/list", async (req, res, next) => {
  try {
    const vouchers = await VoucherModel.find();
    res.json(vouchers);
  } catch (error) {
    next(error);
  }
});

// Route để lấy chi tiết một Voucher dựa trên ID
routerVoucher.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const voucher = await VoucherModel.findById(id);
    if (!voucher) {
      return res.status(404).json({ message: "Không tìm thấy Voucher" });
    }
    res.json(voucher);
  } catch (error) {
    next(error);
  }
});

// Route để cập nhật thông tin một Voucher
routerVoucher.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Code, Mota, Giagiam, Ngayhethan } = req.body;
    const updatedVoucher = await VoucherModel.findByIdAndUpdate(
      id,
      { Code, Mota, Giagiam, Ngayhethan, Ngaycapnhat: Date.now() },
      { new: true }
    );
    if (!updatedVoucher) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy Voucher để cập nhật" });
    }
    res.json(updatedVoucher);
  } catch (error) {
    next(error);
  }
});

// Route để xóa một Voucher
routerVoucher.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedVoucher = await VoucherModel.findByIdAndDelete(id);
    if (!deletedVoucher) {
      return res.status(404).json({ message: "Không tìm thấy Voucher để xóa" });
    }
    res.json({ message: "Xóa Voucher thành công" });
  } catch (error) {
    next(error);
  }
});

// Route để kiểm tra trùng lặp dựa trên mã (Code) của Voucher
routerVoucher.post("/check-duplicate", async (req, res, next) => {
  try {
    const { Code } = req.body;
    const existingVoucher = await VoucherModel.findOne({ Code });
    res.json({ exists: !!existingVoucher });
  } catch (error) {
    next(error);
  }
});

export default routerVoucher;
