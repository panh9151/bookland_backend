import express from "express";
import BinhLuanModel from "../models/BinhLuanModel.js";

const routerBinhLuan = express.Router();

// Lấy danh sách bình luận
routerBinhLuan.get("/list", async (req, res, next) => {
  try {
    const listBinhLuan = await BinhLuanModel.find()
      .populate("id_baiviet", "tieude")
      .populate("id_nguoidung", "ten");

    res.json({ success: true, data: listBinhLuan });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bình luận:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Thêm bình luận mới
routerBinhLuan.post("/add", async (req, res, next) => {
  try {
    const { id, id_baiviet, id_nguoidung, noidung, hienthi } = req.body;

    const newBinhLuan = new BinhLuanModel({
      id,
      id_baiviet,
      id_nguoidung,
      noidung,
      hienthi,
    });

    await newBinhLuan.save();

    res.json({ status: 1, message: "Thêm bình luận thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm bình luận:", err);
    res.status(500).json({ status: 0, message: "Thêm bình luận thất bại" });
  }
});

// Sửa thông tin bình luận
routerBinhLuan.put("/edit/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_baiviet, id_nguoidung, noidung, hienthi } = req.body;

    const updatedBinhLuan = await BinhLuanModel.findByIdAndUpdate(
      id,
      {
        id_baiviet,
        id_nguoidung,
        noidung,
        hienthi,
      },
      { new: true }
    );

    if (updatedBinhLuan) {
      res.json({
        status: 1,
        message: "Sửa thông tin bình luận thành công",
        data: updatedBinhLuan,
      });
    } else {
      res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy bình luận để sửa đổi" });
    }
  } catch (err) {
    console.error("Lỗi khi sửa bình luận:", err);
    res.status(500).json({ status: 0, message: "Sửa bình luận thất bại" });
  }
});

// Xóa bình luận
routerBinhLuan.delete("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const binhluan = await BinhLuanModel.findByIdAndDelete(id);

    if (binhluan) {
      res.json({ status: 1, message: "Xóa bình luận thành công" });
    } else {
      res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy bình luận để xóa" });
    }
  } catch (err) {
    console.error("Lỗi khi xóa bình luận:", err);
    res.status(500).json({ status: 0, message: "Xóa bình luận thất bại" });
  }
});

export default routerBinhLuan;
