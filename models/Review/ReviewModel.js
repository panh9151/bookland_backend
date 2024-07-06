import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  id_user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  id_sach: {
    type: Schema.Types.ObjectId,
    ref: "Sach",
    required: true,
  },
  diem: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5], // Giá trị chỉ có thể là 1, 2, 3, 4 hoặc 5
  },
  txt: String,
  ngaytao: {
    type: Date,
    default: Date.now,
  },
  hien_thi: {
    type: Boolean,
    default: true,
  },
});

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
