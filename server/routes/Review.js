// review.js

import express from "express";
import Review from "../models/Review/ReviewModel.js";

const routerReview = express.Router();

// POST: Tạo review mới
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

// GET: Lấy danh sách tất cả các review
routerReview.get("/list", async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("id_user", "username") // Populate thông tin user chỉ lấy username
      .populate("id_sach", "ten"); // Populate thông tin sách chỉ lấy tên sách

    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// DELETE: Xóa review dựa trên id_review
routerReview.delete("/:id_review", async (req, res) => {
  try {
    const { id_review } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id_review);

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
