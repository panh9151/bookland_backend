import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TheLoaiSachDetailSchema = new Schema({
  id_theloaisachdetail: {
    type: String,
    unique: true,
    required: true,
  },
  id_theloai: {
    type: Schema.Types.ObjectId,
    ref: "TheLoai",
    required: true,
  },
  id_sach: {
    type: Schema.Types.ObjectId,
    ref: "Sach",
    required: true,
  },
});

const TheLoaiSachDetailModel =
  mongoose.models.TheLoaiSachDetail ||
  model("TheLoaiSachDetail", TheLoaiSachDetailSchema);

export default TheLoaiSachDetailModel;
