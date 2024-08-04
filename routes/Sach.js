const express = require("express");
const mongoose = require("mongoose");
const SachModel = require("../models/Sach/SachModel.js");
const TheLoaiSachModel = require("../models/Theloai/TheLoaiSachModel.js");
const TacgiaModel = require("../models/Tacgia/TacgiaModel.js");

const routerSach = express.Router();

// Thêm sách mới
routerSach.post("/", async (req, res) => {
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

    // Kiểm tra tính hợp lệ của các ID
    if (
      !mongoose.Types.ObjectId.isValid(tacgia) ||
      !mongoose.Types.ObjectId.isValid(theloaisach)
    ) {
      return res.status(400).json({
        status: 0,
        message: "ID tác giả hoặc thể loại không hợp lệ",
      });
    }

    // Kiểm tra và lấy thông tin tác giả
    const tacGia = await TacgiaModel.findById(tacgia);
    if (!tacGia) {
      return res.status(404).json({
        status: 0,
        message: "Không tìm thấy thông tin tác giả",
      });
    }

    // Kiểm tra và lấy thông tin thể loại sách
    const theLoaiSach = await TheLoaiSachModel.findById(theloaisach);
    if (!theLoaiSach) {
      return res.status(404).json({
        status: 0,
        message: "Không tìm thấy thông tin thể loại sách",
      });
    }

    // Kiểm tra xem sách đã tồn tại chưa
    const sachExists = await SachModel.findOne({ ten, tacgia });
    if (sachExists) {
      return res.status(400).json({
        status: 0,
        message: "Sách đã tồn tại",
      });
    }

    const newSach = new SachModel({
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
    });

    await newSach.save();

    res.json({ status: 1, message: "Thêm sách thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm sách:", err);
    res.status(500).json({ status: 0, message: "Thêm sách thất bại" });
  }
});

// Sửa thông tin sách
routerSach.put("/:id", async (req, res) => {
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

    // Kiểm tra tính hợp lệ của ID sách
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: 0, message: "ID sách không hợp lệ" });
    }

    // Kiểm tra tính hợp lệ của các ID khác
    if (tacgia && !mongoose.Types.ObjectId.isValid(tacgia)) {
      return res
        .status(400)
        .json({ status: 0, message: "ID tác giả không hợp lệ" });
    }

    if (theloaisach && !mongoose.Types.ObjectId.isValid(theloaisach)) {
      return res
        .status(400)
        .json({ status: 0, message: "ID thể loại sách không hợp lệ" });
    }

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
routerSach.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra tính hợp lệ của ID sách
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: 0, message: "ID sách không hợp lệ" });
    }

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
routerSach.get("/", async (req, res) => {
  try {
    const listSach = await SachModel.find()
      .populate("tacgia", "ten")
      .populate("theloaisach", "ten");

    res.json({ success: true, data: listSach });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sách:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi máy chủ" });
  }
});

// Lấy thông tin một cuốn sách theo ID
routerSach.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra tính hợp lệ của ID sách
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: 0, message: "ID sách không hợp lệ" });
    }

    const sach = await SachModel.findById(id)
      .populate("tacgia", "ten")
      .populate("theloaisach", "ten");

    if (!sach) {
      return res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy sách" });
    }

    res.json({ success: true, data: sach });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin sách:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi máy chủ" });
  }
});

module.exports = routerSach;
