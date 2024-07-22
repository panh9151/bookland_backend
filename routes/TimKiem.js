const express = require("express");
const routerTimKiem = express.Router();
const mongoose = require("mongoose");
const TimKiemModel = require("../models/TimKiem/TimKiemModel.js");
const SachModel = require("../models/Sach/SachModel.js");
const TacgiaModel = require("../models/Tacgia/TacgiaModel.js");

routerTimKiem.get("/search", async (req, res) => {
  try {
    const { text, type } = req.query;
    let results; //data tìm kiếm
    let count;

    if (type === "sach") {
      results = await SachModel.find(
        { ten: { $regex: text, $options: "i" } }, //$regex cho phép tìm kiếm các mẫu chuỗi trong trường ten
        { ten: 1, _id: 0 }
      );
      count = results.length;
    } else if (type === "tacgia") {
      results = await TacgiaModel.find(
        { ten: { $regex: text, $options: "i" } },
        { ten: 1, _id: 0 }
      );
      count = results.length;
    } else {
      return res.status(400).json({ message: "Không có thứ bạn cần" });
    }

    // Lưu lịch sử tìm kiếm vào database
    await TimKiemModel.create({
      id_timkiem: new mongoose.Types.ObjectId().toString(),
      text: text,
      count: count,
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = routerTimKiem;
