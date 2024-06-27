import SachModel from "../models/Sach/SachModel.js";
import express from "express";

const routerSach = express.Router();

// Route kiểm tra sản phẩm trùng
routerSach.post("/check-duplicate", async (req, res, next) => {
  try {
    const { name } = req.body;

    // Tìm sách trong database dựa trên tên
    const existingSach = await SachModel.findOne({ name });

    if (existingSach) {
      // Nếu sách đã tồn tại, trả về thông báo
      return res.json({ exists: true });
    } else {
      // Nếu sách chưa tồn tại, trả về thông báo
      return res.json({ exists: false });
    }
  } catch (error) {
    return next(error);
  }
});

// Route lấy danh sách sách
routerSach.get("/list", async (req, res, next) => {
  try {
    const listSach = await SachModel.find({});
    res.json({ success: true, data: listSach });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Route thêm sách mới
routerSach.post("/add", async (req, res, next) => {
  try {
    const {
      id,
      author,
      nxb,
      img,
      description,
      ngayxuatban,
      ngaytao,
      isRecommended,
      favorite,
      type,
      name,
      view,
      price,
      recommendedPriority,
      star,
      sold,
      language,
    } = req.body;

    const newSach = {
      id,
      author,
      nxb,
      img,
      description,
      ngayxuatban,
      ngaytao,
      isRecommended,
      favorite,
      type,
      name,
      view,
      price,
      recommendedPriority,
      star,
      sold,
      language,
    };

    await SachModel.create(newSach);

    res.json({ status: 1, message: "Thêm sản phẩm thành công" });
  } catch (err) {
    console.error("Error adding product:", err);
    res.json({ status: 0, message: "Thêm sản phẩm thất bại" });
  }
});

// Route sửa thông tin sách
routerSach.put("/edit/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedSach = await SachModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedSach) {
      return res.json({
        status: 0,
        message: "Không tìm thấy sách để cập nhật",
      });
    }

    res.json({ status: 1, message: "Sửa sản phẩm thành công", updatedSach });
  } catch (err) {
    res.json({ status: 0, message: "Sửa sản phẩm thất bại", err: err.message });
  }
});

// Route xóa sách
routerSach.delete("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await SachModel.findByIdAndDelete(id);

    res.json({ status: 1, message: "Xóa sản phẩm thành công" });
  } catch (err) {
    res.json({ status: 0, message: "Xóa sản phẩm thất bại", err: err.message });
  }
});

export default routerSach;
