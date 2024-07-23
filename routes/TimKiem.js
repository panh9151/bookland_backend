const express = require("express");
const routerTimKiem = express.Router();
const mongoose = require("mongoose");
const TimKiemModel = require("../models/TimKiem/TimKiemModel.js");
const Sach = require("../models/Sach/SachModel.js"); // Đường dẫn đến mô hình sách
const Tacgia = require("../models/Tacgia/TacgiaModel.js"); // Đường dẫn đến mô hình tác giả
const Fuse = require("fuse.js");
const diacritics = require("diacritics");

// Hàm loại bỏ dấu
function removeDiacritics(text) {
  return diacritics.remove(text);
}

// Route tìm kiếm
routerTimKiem.get("/search", async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp từ khóa tìm kiếm." });
    }

    // Loại bỏ dấu trong từ khóa tìm kiếm
    const normalizedText = removeDiacritics(text);

    // Lấy tất cả sách và tác giả từ cơ sở dữ liệu
    const books = await Sach.find({}).lean();
    const authors = await Tacgia.find({}).lean();

    // Tiền xử lý dữ liệu để loại bỏ dấu
    books.forEach((book) => {
      book.tenNormalized = removeDiacritics(book.ten);
    });

    authors.forEach((author) => {
      author.tenNormalized = removeDiacritics(author.ten);
    });

    // Khởi tạo Fuse.js với các tùy chọn cho sách
    const fuseBooks = new Fuse(books, {
      keys: ["tenNormalized"], // Các trường để tìm kiếm
      includeScore: true, // Bao gồm điểm số tìm kiếm trong kết quả
      threshold: 0.3, // Ngưỡng độ tương đồng
    });

    // Khởi tạo Fuse.js với các tùy chọn cho tác giả
    const fuseAuthors = new Fuse(authors, {
      keys: ["tenNormalized"], // Các trường để tìm kiếm
      includeScore: true, // Bao gồm điểm số tìm kiếm trong kết quả
      threshold: 0.3, // Ngưỡng độ tương đồng
    });

    // Tìm kiếm sách
    const bookResults = fuseBooks
      .search(normalizedText)
      .map((result) => result.item);
    // Tìm kiếm tác giả
    const authorResults = fuseAuthors
      .search(normalizedText)
      .map((result) => result.item);

    // Chỉ lấy tên sách và tên tác giả từ kết quả
    const bookNames = bookResults.map((book) => ({ ten: book.ten }));
    const authorNames = authorResults.map((author) => ({ ten: author.ten }));

    // Đếm số lượng kết quả
    const count = bookNames.length + authorNames.length;

    if (count === 0) {
      return res
        .status(404)
        .json({
          message: "Không tìm thấy kết quả phù hợp với từ khóa của bạn.",
        });
    }

    // Cập nhật hoặc tạo mới lịch sử tìm kiếm
    const searchRecord = await TimKiemModel.findOne({ text: normalizedText });

    if (searchRecord) {
      // Nếu đã tồn tại, cập nhật count
      await TimKiemModel.findByIdAndUpdate(searchRecord._id, {
        $inc: { count: 1 },
      });
    } else {
      // Nếu không tồn tại, tạo mới với count là 1
      await TimKiemModel.create({
        id_timkiem: new mongoose.Types.ObjectId().toString(),
        text: normalizedText,
        count: 1,
      });
    }

    // Trả về tên sách và tên tác giả
    res.json({ count, books: bookNames, authors: authorNames });
  } catch (error) {
    console.error("Lỗi:", error); // In lỗi để kiểm tra
    res.status(500).json({ message: error.message });
  }
});

module.exports = routerTimKiem;
