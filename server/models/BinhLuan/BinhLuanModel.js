const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BinhLuanSchema = new Schema({
  id_binhluan: {
    type: String,
    unique: true,
    required: true,
  },
  id_reply: {
    type: String,
    ref: "BinhLuan",
  },
  id_user: {
    type: String,
    required: true,
    ref: "User",
  },
  id_sach: {
    type: String,
    required: true,
    ref: "Sach",
  },
  txt: {
    type: String,
  },
  like: {
    type: Number,
    default: 0,
    required: true,
  },
  dislike: {
    type: Number,
    default: 0,
    required: true,
  },
  ngaytao: {
    type: Date,
    required: true,
  },
  hien_thi: {
    type: Boolean,
    default: true,
    required: true,
  },
});

module.exports = mongoose.model("BinhLuan", BinhLuanSchema);
