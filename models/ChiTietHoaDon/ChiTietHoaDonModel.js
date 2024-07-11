import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ChiTietHoaDonSchema = new Schema({
  id_sach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sach",
    required: true,
  },
  id_hoadon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  soluong: {
    type: Number,
    required: true,
  },
});

const ChiTietHoaDonModel = mongoose.model("ChiTietHoaDon", ChiTietHoaDonSchema);

export default ChiTietHoaDonModel;
