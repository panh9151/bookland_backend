import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const TheLoaiSachSchema = new Schema({
  ten: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  hienthi: {
    type: Boolean,
    default: true,
  },
});

const TheLoaiSachModel =
  models.TheLoaiSach || model("TheLoaiSach", TheLoaiSachSchema);

export default TheLoaiSachModel;
