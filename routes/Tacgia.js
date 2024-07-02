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

routerTacgia.delete("/:ten", async function (req, res, next) {
  try {
    let { ten } = req.params;
    await TacgiaModel.deleteOne({ ten: ten });
    const listTacgia = await TacgiaModel.find({});
    res.json({ status: true, data: listTacgia });
  } catch (error) {
    console.log(error);
    res.json({ status: false });
  }
});

export default routerTacgia;
