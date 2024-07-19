// DanhGia.js
const express = require("express");
const DanhGia = require("../models/DanhGia/DanhGiaModel.js");

const routerDanhGia = express.Router();

routerDanhGia.get("/list", async (req, res) => {
  try {
    const DanhGias = await DanhGia.find({})
      .populate("id_nguoidung", "ten")
      .populate("id_sach", "ten");

    res.json({ success: true, data: DanhGias });
  } catch (error) {
    console.error("Error fetching DanhGias:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});
routerDanhGia.get("/sach/:id", async (req, res) => {
  try {
    const { id_sach } = req.params;
    const DanhGias = await DanhGia.find({ id_sach, hien_thi: true })
      .populate("id_nguoidung", "ten") // Populate thông tin tên user
      .populate("id_sach", "ten"); // Populate thông tin tên sách

    if (!DanhGias.length) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy DanhGia cho sách này",
      });
    }

    res.json({ success: true, data: DanhGias });
  } catch (error) {
    console.error("Error fetching DanhGias for the book:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});
//  Tạo DanhGia mới
routerDanhGia.post("/add", async (req, res) => {
  try {
    const { id_nguoidung, id_sach, diem, txt } = req.body;

    const newDanhGia = new DanhGia({
      id_nguoidung,
      id_sach,
      diem,
      txt,
    });

    await newDanhGia.save();
    res.json({ status: 1, message: "Thêm DanhGia thành công", newDanhGia });
  } catch (error) {
    console.error("Error adding DanhGia:", error);
    res.json({ status: 0, message: "Thêm DanhGia thất bại", error });
  }
});

routerDanhGia.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDanhGia = await DanhGia.findByIdAndDelete(id);

    if (!deletedDanhGia) {
      return res.json({ status: 0, message: "Không tìm thấy DanhGia để xóa" });
    }

    res.json({ status: 1, message: "Xóa DanhGia thành công" });
  } catch (error) {
    console.error("Error deleting DanhGia:", error);
    res.json({ status: 0, message: "Xóa DanhGia thất bại", error });
  }
});

module.exports = routerDanhGia;
