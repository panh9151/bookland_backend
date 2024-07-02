import SachModel from "../models/Sach/SachModel.js";

import express from "express";

const routerSach = express.Router();

routerSach.post("/check-duplicate", async (req, res, next) => {
  try {
    const { ten } = req.body;

    // Tìm sản phẩm trong database dựa trên tên
    const existingSach = await Product.findOne({ ten });

    if (existingSach) {
      // Nếu sản phẩm đã tồn tại, trả về thông báo
      return res.json({ exists: true });
    } else {
      // Nếu sản phẩm chưa tồn tại, trả về thông báo
      return res.json({ exists: false });
    }
  } catch (error) {
    return next(error);
  }
});

routerSach.get("/list", async function (req, res, next) {
  try {
    const listSach = await SachModel.find({});
    res.json({ success: true, data: listSach });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

routerSach.post("/add", async function (req, res, next) {
  try {
    const { ten, nxb, img, mieuta, ngayxuatban, ngaytao, language } = req.body;

    const newSach = {
      ten,
      nxb,
      img,
      mieuta,
      ngayxuatban,
      ngaytao,
      language,
    };
    await SachModel.create(newSach);

    res.json({ status: 1, message: "Thêm sản phẩm thành công" });
  } catch (err) {
    console.error("Error adding product:", err);
    res.json({ status: 0, message: "Thêm sản phẩm thất bại" });
  }
  const listSach = await SachModel.find({});
});

routerSach.put("/edit", async function (req, res, next) {
  try {
    const { id_sach, ten, nxb, anh, mieuta, ngayxuatban, ngaytao, language } =
      req.body;
    var item = await SachSchema.findById(id_sach);
    console.log(item);
    if (item) {
      const SachModel = await SachSchema.findByIdAndUpdate(id_sach, {
        ten,
        nxb,
        anh,
        mieuta,
        ngayxuatban,
        ngaytao,
        language,
      });
      res.json({ status: 1, message: "Sửa sản phẩm thành công" });
    }
  } catch (err) {
    res.json({ status: 0, message: "Sửa sản phẩm thất bại" });
  }
  const listSach = await SachModel.find({});
});
//delete
routerSach.get("/delete", async function (req, res, next) {
  try {
    var id_sach = req.body.id_sach;
    await SachModel.findByIdAndDelete(id_sach);
    res.json({ status: 1, message: "Xóa sản phẩm thành công" });
  } catch (err) {
    res.json({ status: 0, message: "Xóa sản phẩm thất bại", err: err });
  }
  const listSach = await SachModel.find({});
});
routerSach.put("/:id_sach", async function (req, res, next) {
  try {
    var id_sach = req.params.id_sach; // Retrieve the product ID from the URL parameters
    const updatedSach = await SachModel.findByIdAndUpdate(id_sach, req.body, {
      new: true,
    });
    res.json({
      status: 1,
      message: "Cập nhật sản phẩm thành công",
      updatedSach,
    });
  } catch (err) {
    res.json({ status: 0, message: "Cập nhật sản phẩm thất bại", err: err });
  }
  const listSach = await SachModel.find({});
});

routerSach.delete("/:ten", async function (req, res, next) {
  try {
    let { ten } = req.params;
    await SachModel.deleteOne({ ten: ten });
    res.json({ status: true });
  } catch (error) {
    console.log(error);
    res.json({ status: false });
  }
  const listSach = await SachModel.find({});
});

export default routerSach;
