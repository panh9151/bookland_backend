import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BaiVietSchema = new Schema({
  id_theloaibaiviet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TheLoaiBaiViet",
    required: true,
  },
  id_nguoidung: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  img: {
    type: String,
  },
  ngaycapnhat: {
    type: Date,
    required: true,
  },
  ngaytao: {
    type: Date,
    required: true,
  },
  mota: {
    type: String,
  },
  luotxem: {
    type: Number,
    default: 0,
  },
  noidung: {
    type: String,
    required: true,
  },
  tieude: {
    type: String,
    required: true,
  },
  trangthai: {
    type: Boolean,
    default: true,
  },
});

const BaiVietModel = mongoose.model("BaiViet", BaiVietSchema);

export default BaiVietModel;
