const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GoiHoivienSchema = new Schema({
  id_goihoivien: {
    type: String,
    unique: true,
    required: true,
  },
  id_user: {
    type: String,
    required: true,
    ref: "User",
  },
  batdau: {
    type: Date,
    required: true,
  },
  ketthuc: {
    type: Date,
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
    enum: [0, 1, 2, 3],
    required: true,
  },
  status: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
    default: 0,
    required: true,
  },
});

module.exports = mongoose.model("GoiHoivien", GoiHoivienSchema);
