import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BannerSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  view: {
    type: Number,
    default: 0,
    required: true,
  },
  ngaybatdau: {
    type: Date,
    required: true,
  },
  ngayketthuc: {
    type: Date,
    required: true,
  },
  uutien: {
    type: Number,
  },
  hien_thi: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const BannerModel = mongoose.model("Banner", BannerSchema);
export default BannerModel;