import express from "express";
import TheLoaiModel from "../models/Theloai/TheLoaiSachModel.js";

const routerTheLoai = express.Router();

// Liệt kê tất cả thể loại
routerTheLoai.get("/list", async (req, res, next) => {
  try {
    const listTheLoai = await TheLoaiModel.find({});
    res.json({ success: true, data: listTheLoai });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thể loại:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi máy chủ" });
  }
});

// Thêm thể loại mới
routerTheLoai.post("/add", async (req, res, next) => {
  try {
    const { id_theloai, ten, img, id_hienthi } = req.body;
    if (!id_theloai || !ten) {
      return res.status(400).json({
        status: 0,
        message: "Các trường bắt buộc không được bỏ trống",
      });
    }

    const newTheLoai = {
      id_theloai,
      ten,
      img,
      id_hienthi,
    };
    await TheLoaiModel.create(newTheLoai);

    res.json({ status: 1, message: "Thêm thể loại thành công" });
  } catch (error) {
    console.error("Lỗi khi thêm thể loại:", error);
    res.status(500).json({ status: 0, message: "Thêm thể loại thất bại" });
  }
});
routerTheLoai.put("/edit/:id", async (req, res, next) => {
  try {
    let { id_theloai } = req.params;
    id_theloai = id_theloai.replace(":", ""); // Loại bỏ ký tự ":"

    const { ten, img, id_hienthi } = req.body;

    // Kiểm tra id_theloai
    if (!id_theloai) {
      return res
        .status(400)
        .json({ status: 0, message: "ID thể loại là bắt buộc" });
    }

    // Kiểm tra thể loại tồn tại
    const theLoai = await TheLoaiModel.findById(id_theloai);
    if (!theLoai) {
      return res
        .status(404)
        .json({ status: 0, message: "Thể loại không tồn tại" });
    }

    // Cập nhật thông tin thể loại
    const updatedTheLoai = await TheLoaiModel.findByIdAndUpdate(
      id_theloai,
      { ten, img, id_hienthi },
      { new: true } // Trả về document đã cập nhật
    );

    if (!updatedTheLoai) {
      return res
        .status(500)
        .json({ status: 0, message: "Sửa thể loại thất bại" });
    }

    res.json({
      status: 1,
      message: "Sửa thể loại thành công",
      data: updatedTheLoai,
    });
  } catch (error) {
    console.error("Lỗi khi chỉnh sửa thể loại:", error);
    res.status(500).json({ status: 0, message: "Sửa thể loại thất bại" });
  }
});
// Xóa thể loại theo tên

routerTheLoai.delete("/del/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    if (!_id) {
      return res
        .status(400)
        .json({ status: false, message: "ID thể loại là bắt buộc" });
    }

    const result = await TheLoaiModel.deleteOne({ _id: _id.slice(1) }); // Sử dụng slice(1) để loại bỏ ký tự ":" đầu tiên
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Thể loại không tồn tại" });
    }

    res.json({ status: true, message: "Xóa thể loại thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa thể loại:", error);
    res.status(500).json({ status: false, message: "Xóa thể loại thất bại" });
  }
});

export default routerTheLoai;

//:_id
