const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LoaiSachSchema = new Schema({
  id_loaisach: {
    type: String,
    unique: true,
    required: true,
  },
  id_sach: {
    type: String,
    required: true,
    ref: "Sach",
  },
  loaisach: {
    type: Number,
    enum: [0, 1],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  view: {
    type: Number,
    default: 0,
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
    required: true,
  },
  hatsoi: Number,
  vnd: Number,
  tichdiem: Number,
  loaigia: {
    type: Number,
    enum: [0, 1, 2, 3],
    required: true,
  },
  hien_thi: {
    type: Boolean,
    default: true,
    required: true,
  },
});

// Tạo model từ schema và xuất ra ngoài module
module.exports = mongoose.model("LoaiSach", LoaiSachSchema);
