import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TheLoaiSchema = new Schema({
  ten: {
    type: String,
    required: true,
    unique: true,
  },
  img: String,
  is_active: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const TheLoaiModel = mongoose.model("TheLoai", TheLoaiSchema);

export default TheLoaiModel;
