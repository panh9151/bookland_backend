// review.js

import express from "express";
import Review from "../models/Review/ReviewModel.js";

const routerReview = express.Router();

routerReview.get("/list", async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("id_user", "ten")
      .populate("id_sach", "ten");

    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});
routerReview.get("/sach/:id_sach", async (req, res) => {
  try {
    const { id_sach } = req.params;
    const reviews = await Review.find({ id_sach, hien_thi: true })
      .populate("id_user", "ten") // Populate thông tin tên user
      .populate("id_sach", "ten"); // Populate thông tin tên sách

    if (!reviews.length) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy review cho sách này",
      });
    }

    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews for the book:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});
//  Tạo review mới
routerReview.post("/add", async (req, res) => {
  try {
    const { id_user, id_sach, diem, txt } = req.body;

    const newReview = new Review({
      id_user,
      id_sach,
      diem,
      txt,
    });

    await newReview.save();
    res.json({ status: 1, message: "Thêm review thành công", newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.json({ status: 0, message: "Thêm review thất bại", error });
  }
});

routerReview.delete("/:id_review", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.json({ status: 0, message: "Không tìm thấy review để xóa" });
    }

    res.json({ status: 1, message: "Xóa review thành công" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.json({ status: 0, message: "Xóa review thất bại", error });
  }
});

export default routerReview;
