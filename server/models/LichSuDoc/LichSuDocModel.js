const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LichSuDocSchema = new Schema({
  id_lichsudoc: {
    type: String,
    unique: true,
    required: true,
  },
  id_sach: {
    type: String,
    required: true,
    ref: "Sach",
  },
  id_user: {
    type: String,
    required: true,
    ref: "User",
  },
  ngaycapnhat: {
    type: Date,
    required: true,
  },
  tiendo: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("LichSuDoc", LichSuDocSchema);
