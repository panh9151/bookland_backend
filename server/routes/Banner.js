import express from "express";
import Joi from "joi";
import Banner from "../models/Banner/BannerModel.js";

const routerBanner = express.Router();

// Schema validate bằng Joi
const bannerSchema = Joi.object({
  id_banner: Joi.string().required().messages({
    "string.empty": "ID là bắt buộc",
  }),
  link: Joi.string().uri().required().messages({
    "string.uri": "Link phải là URL hợp lệ",
  }),
  image: Joi.string().uri().required().messages({
    "string.uri": "Image phải là URL hợp lệ",
  }),
  ngaybatdau: Joi.date().iso().required().messages({
    "date.format": "Ngày bắt đầu phải là ngày hợp lệ",
  }),
  ngayketthuc: Joi.date().iso().required().messages({
    "date.format": "Ngày kết thúc phải là ngày hợp lệ",
  }),
  uutien: Joi.number().integer().min(0).required().messages({
    "number.base": "Ưu tiên phải là số nguyên không âm",
  }),
  hien_thi: Joi.boolean().required().messages({
    "boolean.base": "Hiển thị phải là giá trị boolean",
  }),
});

// Middleware validate bằng Joi
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      errors: error.details.map((detail) => ({
        message: detail.message,
        path: detail.path,
      })),
    });
  }
  next();
};

routerBanner.post("/add", validate(bannerSchema), async (req, res, next) => {
  try {
    const {
      id_banner,
      link,
      image,
      ngaybatdau,
      ngayketthuc,
      uutien,
      hien_thi,
    } = req.body;

    const newBanner = {
      id_banner,
      link,
      image,
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

routerBanner.put("/edit", validate(bannerSchema), async (req, res, next) => {
  try {
    const {
      id_banner,
      link,
      image,

      ngaybatdau,
      ngayketthuc,
      uutien,
      hien_thi,
    } = req.body;
    const item = await Banner.findById(id_banner);
    if (item) {
      await Banner.findByIdAndUpdate(id_banner, {
        link,
        image,

        ngaybatdau,
        ngayketthuc,
        uutien,
        hien_thi,
      });
      res.json({ status: 1, message: "Sửa banner thành công" });
    } else {
      res.json({ status: 0, message: "Không tìm thấy banner" });
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
