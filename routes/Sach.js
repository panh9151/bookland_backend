import express from "express";
import SachModel from "../models/Sach/SachModel.js";

const routerSach = express.Router();

// Lấy danh sách sách
routerSach.get("/list", async (req, res, next) => {
  try {
    const listSach = await SachModel.find()
      .populate("tacgia", "ten")
      .populate("theloai", "ten");

    // ("tacgia theloai");
    res.json({ success: true, data: listSach });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sách:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Thêm sách mới
routerSach.post("/add", async (req, res, next) => {
  try {
    const {
      tacgia,
      nxb,
      img,
      description,
      ngayxuatban,
      isRecommended,
      ten,
      view,
      price,
      recomendedPriority,
      star,
      sold,
      language,
      hien_thi,
      theloai,
    } = req.body;

    const newSach = new SachModel({
      tacgia,
      nxb,
      img,
      description,
      ngayxuatban,
      isRecommended,
      ten,
      view,
      price,
      recomendedPriority,
      star,
      sold,
      language,
      hien_thi,
      theloai,
    });

    await newSach.save();

    res.json({ status: 1, message: "Thêm sách thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm sách:", err);
    res.status(500).json({ status: 0, message: "Thêm sách thất bại" });
  }
});

// Sửa thông tin sách
routerSach.put("/edit/:id_sach", async (req, res, next) => {
  try {
    const { id_sach } = req.params;
    const {
      tacgia,
      nxb,
      img,
      description,
      ngayxuatban,
      isRecommended,
      ten,
      view,
      price,
      recomendedPriority,
      star,
      sold,
      language,
      hien_thi,
      theloai,
    } = req.body;

    const updatedSach = await SachModel.findByIdAndUpdate(
      id_sach,
      {
        tacgia,
        nxb,
        img,
        description,
        ngayxuatban,
        isRecommended,
        ten,
        view,
        price,
        recomendedPriority,
        star,
        sold,
        language,
        hien_thi,
        theloai,
      },
      { new: true }
    );

    if (updatedSach) {
      res.json({
        status: 1,
        message: "Sửa thông tin sách thành công",
        data: updatedSach,
      });
    } else {
      res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy sách để sửa đổi" });
    }
  } catch (err) {
    console.error("Lỗi khi sửa sách:", err);
    res.status(500).json({ status: 0, message: "Sửa sách thất bại" });
  }
});

// Xóa sách
routerSach.delete("/delete/:id_sach", async (req, res, next) => {
  try {
    const { id_sach } = req.params;
    const sach = await SachModel.findByIdAndDelete(id_sach);

    if (sach) {
      res.json({ status: 1, message: "Xóa sách thành công" });
    } else {
      res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy sách để xóa" });
    }
  } catch (err) {
    console.error("Lỗi khi xóa sách:", err);
    res.status(500).json({ status: 0, message: "Xóa sách thất bại" });
  }
});

export default routerSach;
