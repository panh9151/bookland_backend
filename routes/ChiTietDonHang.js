import express from "express";
import ChiTietDonHangModel from "../models/ChiTietDonHang/ChiTietDonHangModel.js";

const routerChiTietDonHang = express.Router();

// Lấy chi tiết hóa đơn theo id hóa đơn
routerChiTietDonHang.get("/:id_hoadon", async (req, res, next) => {
  try {
    const { id_hoadon } = req.params;
    const details = await ChiTietDonHangModel.find({ id_hoadon })
      .populate("id_sach", "ten gia")
      .exec();

    if (!details || details.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy chi tiết hóa đơn" });
    }

    res.json({ success: true, data: details });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Thêm chi tiết hóa đơn mới
routerChiTietDonHang.post("/add", async (req, res, next) => {
  try {
    const { id_sach, id_hoadon, price, soluong } = req.body;

    const newDetail = new ChiTietDonHangModel({
      id_sach,
      id_hoadon,
      price,
      soluong,
    });

    await newDetail.save();

    res.json({ success: true, message: "Thêm chi tiết hóa đơn thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm chi tiết hóa đơn:", err);
    res
      .status(500)
      .json({ success: false, message: "Thêm chi tiết hóa đơn thất bại" });
  }
});

// Xóa chi tiết hóa đơn
routerChiTietDonHang.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedDetail = await ChiTietDonHangModel.findByIdAndDelete(id);

    if (!deletedDetail) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi tiết hóa đơn để xóa",
      });
    }

    res.json({ success: true, message: "Xóa chi tiết hóa đơn thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa chi tiết hóa đơn:", err);
    res
      .status(500)
      .json({ success: false, message: "Xóa chi tiết hóa đơn thất bại" });
  }
});

export default routerChiTietDonHang;
