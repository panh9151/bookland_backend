import mongoose from "mongoose";
const Schema = mongoose.Schema;

const VoucherSchema = new Schema({
  Code: { type: String, required: true, unique: true },
  Mota: { type: String },
  Giagiam: { type: Number, required: true },
  Ngayhethan: { type: String, required: true },
  Ngaytao: { type: Date, default: Date.now },
  Ngaycapnhat: { type: Date, default: Date.now },
});

const VoucherModel = mongoose.model("Voucher", VoucherSchema);
export default VoucherModel;
