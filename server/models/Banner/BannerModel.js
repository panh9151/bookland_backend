import mongoose from "mongoose";
const { Schema } = mongoose;

const BannerSchema = new Schema(
  {
    id_banner: {
      type: String,
      unique: true,
      required: true,
    },
    link: {
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
    },
    ngayketthuc: {
      type: Date,
    },
    uutien: {
      type: Number,
    },
    hien_thi: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
); // tự động thêm timestamp

const Banner = mongoose.model("Banner", BannerSchema);
export default Banner;
