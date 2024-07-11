import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BinhLuanSchema = new Schema({
  id_blog: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Blog",
  },
  id_nguoidung: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  noidung: {
    type: String,
    required: true,
  },
  thoigiantao: {
    type: Date,
    required: true,
    default: Date.now,
  },
  hienthi: {
    type: Boolean,
    default: true,
  },
});

const BinhLuanModel = mongoose.model("BinhLuan", BinhLuanSchema);

export default BinhLuanModel;
