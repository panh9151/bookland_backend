import TacgiaModel from "../models/Tacgia/TacgiaModel.js";
import express from "express";

const routerTacgia = express.Router();

routerTacgia.post("/check-duplicate", async (req, res, next) => {
  try {
    const { ten } = req.body;
    const existingTacgia = await TacgiaModel.findOne({ ten });

    if (existingTacgia) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    return next(error);
  }
});

routerTacgia.get("/list", async function (req, res, next) {
  try {
    const listTacgia = await TacgiaModel.find({});
    res.json({ success: true, data: listTacgia });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});
routerTacgia.get("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const tacgia = await TacgiaModel.findById(id);

    if (!tacgia) {
      return res.status(404).json({ message: "Không tìm thấy tác giả" });
    }

    res.json({ success: true, data: tacgia });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tác giả:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});
routerTacgia.post("/add", async function (req, res, next) {
  try {
    const { id_tacgia, ten, img, tieusu, is_active } = req.body;

    // Kiểm tra xem id_tacgia đã tồn tại hay chưa
    const existingTacgia = await TacgiaModel.findOne({ id_tacgia });
    if (existingTacgia) {
      return res.json({
        status: 0,
        message: "ID tác giả đã tồn tại",
      });
    }

    const newTacgia = {
      id_tacgia,
      ten,
      img,
      tieusu,
      is_active,
    };
    await TacgiaModel.create(newTacgia);

    res.json({ status: 1, message: "Thêm tác giả thành công" });
  } catch (err) {
    console.error("Error adding author:", err);
    res.json({
      status: 0,
      message: "Thêm tác giả thất bại",
      error: err.message,
    });
  }
  const listTacgia = await TacgiaModel.find({});
});

routerTacgia.put("/edit", async function (req, res, next) {
  try {
    const { id_tacgia, ten, img, tieusu, is_active } = req.body;
    var item = await TacgiaModel.findById(id_tacgia);
    if (item) {
      const updatedTacgia = await TacgiaModel.findByIdAndUpdate(
        id_tacgia,
        {
          ten,
          img,
          tieusu,
          is_active,
        },
        { new: true }
      );
      res.json({
        status: 1,
        message: "Sửa tác giả thành công",
        data: updatedTacgia,
      });
    }
  } catch (err) {
    console.error("Error updating author:", err);
    res.json({ status: 0, message: "Sửa tác giả thất bại" });
  }
});

routerTacgia.delete("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;

    await TacgiaModel.deleteOne({ _id: id });
    const listTacgia = await TacgiaModel.find({});
    res.json({ status: true, data: listTacgia });
  } catch (error) {
    console.error("Lỗi khi xóa tác giả:", error);
    res.json({ status: false });
  }
});

export default routerTacgia;
