// models/TheLoaiSachModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SachModel = require("./models/Sach/SachModel"); // Import model Sach

const TheLoaiSachSchema = new Schema({
  ten: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  hienthi: {
    type: Boolean,
    default: true,
  },
});

// Thiết lập hook pre hoặc post
TheLoaiSachSchema.pre("remove", async function (next) {
  try {
    // Xóa thể loại trong sách tương ứng
    await SachModel.updateMany(
      { theloai: this._id },
      { $pull: { theloai: this._id } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

const TheLoaiSachModel = mongoose.model("TheLoaiSach", TheLoaiSachSchema);
module.exports = TheLoaiSachModel;
