import express from "express";
import SachModel from "../models/Sach/SachModel.js";

const routerSachDetail = express.Router();

// API để lấy chi tiết một cuốn sách
routerSachDetail.get("/detail/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm sách trong cơ sở dữ liệu bằng id
    const Sach = await SachModel.findById(id);

    if (!Sach) {
      return res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy sách" });
    }

    res.status(200).json({ status: 1, data: Sach });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sách:", error);
    res.status(500).json({ status: 0, message: "Lỗi khi lấy chi tiết sách" });
  }
});

export default routerSachDetail;
