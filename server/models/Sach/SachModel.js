import mongoose from "mongoose";

const typeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
  },
  img: {
    type: String,
  },
});

const SachSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  nxb: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ngayxuatban: {
    type: String,
    required: true,
  },
  ngaytao: {
    type: Date,
    default: Date.now,
  },
  isRecommended: {
    type: Boolean,
    required: true,
  },
  favorite: {
    type: Number,
    required: true,
  },
  type: [typeSchema],
  name: {
    type: String,
    required: true,
  },
  view: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  recomendedPriority: {
    type: Number,
    default: null,
  },
  star: {
    type: Number,
    required: true,
  },
  sold: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
});

const SachModel = mongoose.model("Sach", SachSchema);

export default SachModel;
