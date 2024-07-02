import mongoose from "mongoose";
// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
const SachSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  id_tacgia: { type: String },
  nxb: { type: String },
  img: { type: String, required: true },
  description: { type: String },
  ngayxuatban: { type: Date },
  ngaytao: { type: Date },
  isRecommended: { type: Boolean, default: false, required: true },
  ten: { type: String, required: true },
  view: { type: Number, default: 0, required: true },
  price: { type: Number, required: true },
  recomendedPriority: { type: Number, default: 0, required: true },
  star: { type: Number, required: true },
  sold: { type: Number, default: 0, required: true },
  language: { type: String },
  hien_thi: { type: Boolean, default: true, required: true }
});

const SachModel = mongoose.model("Sach", SachSchema);

export default SachModel;
