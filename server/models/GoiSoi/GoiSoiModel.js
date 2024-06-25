const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GoiSoiSchema = new Schema({
  id_goihatsoi: {
    type: String,
    unique: true,
    required: true,
  },
  id_user: {
    type: String,
    ref: "User",
    required: true,
  },
  sosoi: {
    type: Number,
    required: true,
  },
  sotien: {
    type: Number,
    required: true,
  },
  phuongthuc: {
    type: String,
    required: true,
  },
  sdt: {
    type: String,
  },
  ghichu: {
    type: String,
  },
  ngaythanhtoan: {
    type: Date,
  },
  loaigoi: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6],
    default: 0,
    required: true,
  },
  status: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
    default: 0,
    required: true,
  },
});

module.exports = mongoose.model("GoiSoi", GoiSoiSchema);
