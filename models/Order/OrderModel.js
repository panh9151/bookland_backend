import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  id_order: { type: String, unique: true, required: true },
  id_user: { type: String, required: true },
  diachi: { type: String, required: true },
  sdt: { type: Number, required: true },
  nguoinhan: { type: String },
  phuongthucthanhtoan: { type: Number, required: true, enum: [0, 1] }, // 0: tienmat, 1: nganhang
  ghichu: { type: String },
  order_date: { type: Date, required: true },
  status: { type: Number, required: true, enum: [0, 1, 2, 3, 4] }, // 0: choduyet, 1: danggiaohang, 2: dagiaohang, 3: huy, 4: trahang
  thanhtoan: { type: Number, required: true, enum: [0, 1] } // 0: chuathanhtoan, 1: dathanhtoan
});

const OrderModel = mongoose.model("Order", OrderSchema);

export default OrderModel;
