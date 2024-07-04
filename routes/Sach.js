import express from "express";
import SachModel from "../models/Sach/SachModel.js";

const routerSach = express.Router();

routerSach.post("/check-duplicate", async (req, res, next) => {
  try {
    const { ten } = req.body;
    const existingSach = await SachModel.findOne({ ten });

    if (existingSach) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    return next(error);
  }
});

routerSach.get("/list", async (req, res, next) => {
  try {
    const listSach = await SachModel.find().populate("tacgia theloai");
    res.json({ success: true, data: listSach });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

routerSach.post("/add", async (req, res, next) => {
  try {
    const {
      tacgia,
      nxb,
      img,
      description,
      ngayxuatban,
      ngaytao,
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
      ngaytao,
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
    res.json({ status: 0, message: "Thêm sách thất bại" });
  }
});

routerSach.put("/edit/:id_sach", async (req, res, next) => {
  try {
    const { id_sach } = req.params;
    const {
      tacgia,
      nxb,
      img,
      description,
      ngayxuatban,
      ngaytao,
      isRecommended,
      ten,
      view,
      price,
      recomendedPriority,
      star,
      sold,
      language,
      hien_thi,
    } = req.body;

    const updatedSach = await SachModel.findByIdAndUpdate(
      id_sach,
      {
        tacgia,
        nxb,
        img,
        description,
        ngayxuatban,
        ngaytao,
        isRecommended,
        ten,
        view,
        price,
        recomendedPriority,
        star,
        sold,
        language,
        hien_thi,
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
      res.json({ status: 0, message: "Không tìm thấy sách để sửa đổi" });
    }
  } catch (err) {
    console.error("Lỗi khi sửa sách:", err);
    res.json({ status: 0, message: "Sửa sách thất bại" });
  }
});

routerSach.delete("/delete/:id_sach", async (req, res, next) => {
  try {
    const { id_sach } = req.params;
    await SachModel.findByIdAndDelete(id_sach);
    res.json({ status: 1, message: "Xóa sách thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa sách:", err);
    res.json({ status: 0, message: "Xóa sách thất bại" });
  }
});

export default routerSach;
