const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TheLoaiSachDetailSchema = new Schema({
  id_theloaisachdetail: {
    type: String,
    unique: true,
    required: true,
  },
  id_theloai: {
    type: String,
    required: true,
    ref: "TheLoai",
  },
  id_sach: {
    type: String,
    required: true,
    ref: "Sach",
  },
});

module.exports =
  mongoose.models.TheLoaiSachDetail ||
  mongoose.model("TheLoaiSachDetail", TheLoaiSachDetailSchema);
