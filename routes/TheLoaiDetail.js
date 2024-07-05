import express from "express";
import TheLoaiModel from "../models/TheLoai/TheLoaiModel.js";
import TheLoaiSachDetailModel from "../models/TheLoai/TheLoaiSachDetailModel.js";
import SachModel from "../models/Sach/SachModel.js";

const routerTheLoaiDetail = express.Router();

routerTheLoaiDetail.get("/:id_theloai", async (req, res, next) => {
  try {
    const { id_theloai } = req.params;

    const theLoai = await TheLoaiModel.findById(id_theloai);
    if (!theLoai) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy thể loại" });
    }

    const theLoaiSachDetails = await TheLoaiSachDetailModel.find({
      id_theloai,
    });
    const sachIds = theLoaiSachDetails.map((detail) => detail.id_sach);

    const sachList = await SachModel.find({ _id: { $in: sachIds } });

    res.json({ success: true, theLoai, sachList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

export default routerTheLoaiDetail;
