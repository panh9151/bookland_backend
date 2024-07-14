import express from "express";
import SachModel from "../models/Sach/SachModel.js";
import TheLoaiSachModel from "../models/Theloai/TheLoaiSachModel.js";
import TacgiaModel from "../models/Tacgia/TacgiaModel.js";
const routerSach = express.Router();

// Thêm sách mới
routerSach.post("/add", async (req, res, next) => {
  try {
    const {
      tacgia,
      nxb,
      img,
      mota,
      ngayxuatban,
      ten,
      luotxem,
      gia,
      giacu,
      ngonngu,
      hien_thi,
      theloaisach,
    } = req.body;

    if (!ten || !tacgia || !theloaisach) {
      return res.status(400).json({
        status: 0,
        message: "Tên, tác giả, và thể loại là các trường bắt buộc",
      });
    }

    // Kiểm tra và lấy tên của tác giả từ model Tacgia
    const tacGia = await TacgiaModel.findById(tacgia);
    if (!tacGia) {
      return res.status(404).json({
        status: 0,
        message: "Không tìm thấy thông tin tác giả",
      });
    }

    // Kiểm tra và lấy tên của thể loại sách từ model TheloaiSach
    const theLoaiSach = await TheLoaiSachModel.findById(theloaisach);
    if (!theLoaiSach) {
      return res.status(404).json({
        status: 0,
        message: "Không tìm thấy thông tin thể loại sách",
      });
    }
    const sachExists = await SachModel.findOne({ ten, tacgia });
    if (sachExists) {
      return res.status(400).json({
        status: 0,
        message: "Sách đã tồn tại",
      });
    }

    const newSach = new SachModel({
      tacgia: tacgia,
      nxb: nxb,
      img: img,
      mota: mota,
      ngayxuatban: ngayxuatban,
      ten: ten,
      luotxem: luotxem,
      gia: gia,
      giacu: giacu,
      ngonngu: ngonngu,
      hien_thi: hien_thi,
      theloaisach: theloaisach,
    });

    await newSach.save();

    res.json({ status: 1, message: "Thêm sách thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm sách:", err);
    res.status(500).json({ status: 0, message: "Thêm sách thất bại" });
  }
});

// Sửa thông tin sách
routerSach.put("/edit/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      tacgia,
      nxb,
      img,
      mota,
      ngayxuatban,
      ten,
      luotxem,
      gia,
      giacu,
      ngonngu,
      hien_thi,
      theloaisach,
    } = req.body;

    const updatedSach = await SachModel.findByIdAndUpdate(
      id,
      {
        tacgia,
        nxb,
        img,
        mota,
        ngayxuatban,
        ten,
        luotxem,
        gia,
        giacu,
        ngonngu,
        hien_thi,
        theloaisach,
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
routerSach.delete("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const sach = await SachModel.findByIdAndDelete(id);

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
// Lấy danh sách sách
routerSach.get("/list", async (req, res, next) => {
  try {
    const listSach = await SachModel.find()
      .populate("TacGia", "ten") // Populate để lấy tên của tác giả
      .populate("TheLoaiSach", "ten"); // Populate để lấy tên của thể loại sách

    res.json({ success: true, data: listSach });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sách:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi máy chủ" });
  }
});

export default routerSach;
