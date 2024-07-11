import express from "express";
import BaiVietModel from "../models/BaiViet/BaiVietModel.js";

const routerBaiViet = express.Router();

// Lấy danh sách bài viết
routerBaiViet.get("/list", async (req, res, next) => {
  try {
    const listBaiViet = await BaiVietModel.find()
      .populate("id_theloaiBaiViet", "ten")
      .populate("id_nguoidung", "ten");
    res.json({ success: true, data: listBaiViet });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Thêm bài viết mới
routerBaiViet.post("/add", async (req, res, next) => {
  try {
    const {
      img,
      ngaycapnhat,
      ngaytao,
      mota,
      luotxem,
      noidung,
      tieude,
      trangthai,
    } = req.body;

    const newBaiViet = new BaiVietModel({
      img,
      ngaycapnhat,
      ngaytao,
      mota,
      luotxem,
      noidung,
      tieude,
      trangthai,
    });

    await newBaiViet.save();

    res.json({ status: 1, message: "Thêm bài viết thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm bài viết:", err);
    res.status(500).json({ status: 0, message: "Thêm bài viết thất bại" });
  }
});

// Sửa thông tin bài viết
routerBaiViet.put("/edit/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      img,
      ngaycapnhat,
      ngaytao,
      mota,
      luotxem,
      noidung,
      tieude,
      trangthai,
    } = req.body;

    const updatedBaiViet = await BaiVietModel.findByIdAndUpdate(
      id,
      {
        img,
        ngaycapnhat,
        ngaytao,
        mota,
        luotxem,
        noidung,
        tieude,
        trangthai,
      },
      { new: true }
    );

    if (updatedBaiViet) {
      res.json({
        status: 1,
        message: "Sửa thông tin bài viết thành công",
        data: updatedBaiViet,
      });
    } else {
      res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy bài viết để sửa đổi" });
    }
  } catch (err) {
    console.error("Lỗi khi sửa bài viết:", err);
    res.status(500).json({ status: 0, message: "Sửa bài viết thất bại" });
  }
});

// Xóa bài viết
routerBaiViet.delete("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const BaiViet = await BaiVietModel.findByIdAndDelete(id);

    if (BaiViet) {
      res.json({ status: 1, message: "Xóa bài viết thành công" });
    } else {
      res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy bài viết để xóa" });
    }
  } catch (err) {
    console.error("Lỗi khi xóa bài viết:", err);
    res.status(500).json({ status: 0, message: "Xóa bài viết thất bại" });
  }
});

export default routerBaiViet;
