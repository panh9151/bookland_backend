import mongoose from "mongoose";
const { Schema } = mongoose;

const SachSchema = new Schema({
  tacgia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tacgia",
    required: true,
  },
  nxb: { type: String },
  img: { type: String, required: true },
  description: { type: String },
  ngayxuatban: { type: Date },
  ngaytao: { type: Date, default: Date.now },
  isRecommended: { type: Boolean, default: false, required: true },
  ten: { type: String, required: true },
  view: { type: Number, default: 0, required: true },
  price: { type: Number, required: true },
  recomendedPriority: { type: Number, default: 0, required: true },
  star: { type: Number, required: true },
  sold: { type: Number, default: 0, required: true },
  language: { type: String },
  theloai: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TheLoai",
      required: true,
    },
  ],
  hien_thi: { type: Boolean, default: true, required: true },
});

const SachModel = mongoose.model("Sach", SachSchema);
export default SachModel;
