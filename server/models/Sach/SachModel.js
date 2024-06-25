import mongoose from "mongoose";
// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
const SachSchema = new mongoose.Schema({
  // id: {
  //   type: ObjectId,
  //   require: true,
  // },

  ten: {
    type: String,
    required: true,
  },
  nxb: { type: String, required: true },
  anh: { type: String, required: true },
  mieuta: { type: String, required: true },
  ngayxuatban: { type: Date, required: true },
  ngaytao: { type: Date, default: Date.now },
  language: { type: String, required: true },
});

const SachModel = mongoose.model("Sach", SachSchema);

export default SachModel;
