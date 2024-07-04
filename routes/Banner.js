import BannerModel from "../models/Banner/BannerModel.js";
import express from "express";

const routerBanner = express.Router();

// Thêm banner
routerBanner.post("/add", async (req, res) => {
  const { id_banner, url, image, ngaybatdau, ngayketthuc, uutien, hien_thi } =
    req.body;
  try {
    const newBanner = new BannerModel({
      id_banner,
      url,
      image,
      ngaybatdau,
      ngayketthuc,
      uutien,
      hien_thi,
    });
    await newBanner.save();
    res.status(201).json(newBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Sửa banner
routerBanner.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { url, image, ngaybatdau, ngayketthuc, uutien, hien_thi } = req.body;
  try {
    const updatedBanner = await BannerModel.findByIdAndUpdate(
      id,
      {
        url,
        image,
        ngaybatdau,
        ngayketthuc,
        uutien,
        hien_thi,
      },
      { new: true }
    );
    res.status(200).json(updatedBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Xóa banner
routerBanner.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await BannerModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Banner đã được xóa" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lấy danh sách banner
routerBanner.get("/list", async (req, res) => {
  const currentDate = new Date();
  try {
    const banners = await BannerModel.find({
      ngaybatdau: { $lte: currentDate },
      ngayketthuc: { $gte: currentDate },
      hien_thi: true,
    });
    res.status(200).json(banners);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default routerBanner;
