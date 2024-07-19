const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SachSchema = new Schema({
  tacgia: {
    type: Schema.Types.ObjectId,
    ref: "Tacgia", // Tên mô hình phải khớp với tên mô hình được xuất ra
  },
  theloaisach: {
    type: Schema.Types.ObjectId,
    ref: "TheLoaiSach", // Tên mô hình phải khớp với tên mô hình được xuất ra
  },
  nxb: String,
  img: String,
  mota: String,
  ngayxuatban: Date,
  ngaytao: { type: Date, default: Date.now },
  ten: String,
  luotxem: Number,
  gia: Number,
  giacu: Number,
  ngonngu: String,
  hien_thi: Boolean,
});

module.exports = mongoose.model("Sach", SachSchema);
