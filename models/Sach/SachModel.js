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
  mota: { type: String },
  ngayxuatban: { type: Date },
  ngaytao: { type: Date, default: Date.now },
  ten: { type: String, required: true },
  luotxem: { type: Number, default: 0, required: true },
  gia: { type: Number, required: true },
  giacu: { type: Number, default: 0, required: true },
  ngonngu: { type: String },
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
