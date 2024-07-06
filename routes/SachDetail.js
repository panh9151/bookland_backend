import express from "express";
import SachModel from "../models/Sach/SachModel.js";

const routerSachDetail = express.Router();

// Lấy thông tin một quyển sách theo ID
routerSachDetail.get("/:id_sach", async (req, res, next) => {
  try {
    const { id_sach } = req.params;
    const sach = await SachModel.findById(id_sach).populate("tacgia theloai");

    if (!sach) {
      return res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy sách" });
    }

    res.json({ status: 1, data: sach });
  } catch (err) {
    console.error("Lỗi khi lấy thông tin sách:", err);
    res.status(500).json({ status: 0, message: "Lỗi khi lấy thông tin sách" });
  }
});

export default routerSachDetail;
