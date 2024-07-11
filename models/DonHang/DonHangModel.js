import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DonHangSchema = new Schema({
  id_nguoidung: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  diachi: { type: String, required: true },
  sdt: { type: Number, required: true },
  nguoinhan: { type: String },
  phuongthucthanhtoan: { type: Number, required: true, enum: [0, 1] }, // 0: tienmat, 1: nganhang
  ghichu: { type: String },
  ngaydathang: { type: Date, required: true },
  status: { type: Number, required: true, enum: [0, 1, 2, 3, 4] }, // 0: choduyet, 1: danggiaohang, 2: dagiaohang, 3: huy, 4: trahang
  thanhtoan: { type: Number, required: true, enum: [0, 1] }, // 0: chuathanhtoan, 1: dathanhtoan
});

const DonHangModel = mongoose.model("DonHang", DonHangSchema);

export default DonHangModel;
