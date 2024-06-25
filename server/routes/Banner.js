import express from "express";
import Banner from "../models/Banner/BannerModel.js";

const routerBanner = express.Router();

routerBanner.post("/check-duplicate", async (req, res, next) => {
  try {
    const { id_banner } = req.body;

    const existingBanner = await Banner.findOne({ id_banner });

    if (existingBanner) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    return next(error);
  }
});

routerBanner.get("/list", async (req, res, next) => {
  try {
    const listBanner = await Banner.find({});
    res.json({ success: true, data: listBanner });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

routerBanner.post("/add", async (req, res, next) => {
  try {
    const {
      id_banner,
      link,
      image,
      view,
      ngaybatdau,
      ngayketthuc,
      uutien,
      hien_thi,
    } = req.body;

    const newBanner = {
      id_banner,
      link,
      image,
      view,
      ngaybatdau,
      ngayketthuc,
      uutien,
      hien_thi,
    };
    await Banner.create(newBanner);

    res.json({ status: 1, message: "Thêm banner thành công" });
  } catch (err) {
    console.error("Error adding banner:", err);
    res.json({ status: 0, message: "Thêm banner thất bại" });
  }
});

routerBanner.put("/edit", async (req, res, next) => {
  try {
    const {
      id_banner,
      link,
      image,
      view,
      ngaybatdau,
      ngayketthuc,
      uutien,
      hien_thi,
    } = req.body;
    const item = await Banner.findById(id_banner);
    console.log(item);
    if (item) {
      await Banner.findByIdAndUpdate(id_banner, {
        link,
        image,
        view,
        ngaybatdau,
        ngayketthuc,
        uutien,
        hien_thi,
      });
      res.json({ status: 1, message: "Sửa banner thành công" });
    }
  } catch (err) {
    res.json({ status: 0, message: "Sửa banner thất bại" });
  }
});

routerBanner.delete("/:id_banner", async (req, res, next) => {
  try {
    const { id_banner } = req.params;
    await Banner.deleteOne({ id_banner });
    res.json({ status: true });
  } catch (error) {
    console.log(error);
    res.json({ status: false });
  }
});

export default routerBanner;
