import express from "express";
import TheLoaiBaiVietModel from "../models/TheLoaiBaiVietModel.js";

const routerTheLoaiBaiViet = express.Router();

// Thêm thể loại bài viết mới
routerTheLoaiBaiViet.post("/add", async (req, res) => {
  try {
    const { ten, hienthi } = req.body;
    const newTheLoaiBaiViet = new TheLoaiBaiVietModel({
      ten,
      hienthi,
    });

    await newTheLoaiBaiViet.save();
    res.json({ status: 1, message: "Thêm thể loại bài viết thành công" });
  } catch (error) {
    console.error("Lỗi khi thêm thể loại bài viết:", error);
    res
      .status(500)
      .json({ status: 0, message: "Thêm thể loại bài viết thất bại" });
  }
});

// Sửa thể loại bài viết
routerTheLoaiBaiViet.put("/edit/:id_theloaiblog", async (req, res) => {
  try {
    const { id_theloaiblog } = req.params;
    const { ten, hienthi } = req.body;

    const updatedTheLoaiBaiViet = await TheLoaiBaiVietModel.findByIdAndUpdate(
      id_theloaiblog,
      { ten, hienthi },
      { new: true }
    );

    if (updatedTheLoaiBaiViet) {
      res.json({
        status: 1,
        message: "Sửa thể loại bài viết thành công",
        data: updatedTheLoaiBaiViet,
      });
    } else {
      res
        .status(404)
        .json({
          status: 0,
          message: "Không tìm thấy thể loại bài viết để sửa đổi",
        });
    }
  } catch (error) {
    console.error("Lỗi khi sửa thể loại bài viết:", error);
    res
      .status(500)
      .json({ status: 0, message: "Sửa thể loại bài viết thất bại" });
  }
});

// Xóa thể loại bài viết
routerTheLoaiBaiViet.delete("/delete/:id_theloaiblog", async (req, res) => {
  try {
    const { id_theloaiblog } = req.params;
    const deletedTheLoaiBaiViet = await TheLoaiBaiVietModel.findByIdAndDelete(
      id_theloaiblog
    );

    if (deletedTheLoaiBaiViet) {
      res.json({ status: 1, message: "Xóa thể loại bài viết thành công" });
    } else {
      res
        .status(404)
        .json({
          status: 0,
          message: "Không tìm thấy thể loại bài viết để xóa",
        });
    }
  } catch (error) {
    console.error("Lỗi khi xóa thể loại bài viết:", error);
    res
      .status(500)
      .json({ status: 0, message: "Xóa thể loại bài viết thất bại" });
  }
});

// Lấy danh sách thể loại bài viết
routerTheLoaiBaiViet.get("/list", async (req, res) => {
  try {
    const listTheLoaiBaiViet = await TheLoaiBaiVietModel.find({});
    res.json({ success: true, data: listTheLoaiBaiViet });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thể loại bài viết:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Lấy thông tin chi tiết của một thể loại bài viết
routerTheLoaiBaiViet.get("/:id_theloaiblog", async (req, res) => {
  try {
    const { id_theloaiblog } = req.params;
    const theloaiblog = await TheLoaiBaiVietModel.findById(id_theloaiblog);

    if (!theloaiblog) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thể loại bài viết" });
    }

    res.json({ success: true, data: theloaiblog });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin thể loại bài viết:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

export default routerTheLoaiBaiViet;
