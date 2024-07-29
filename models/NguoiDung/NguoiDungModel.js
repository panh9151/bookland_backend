const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

function format(value) {
  if (typeof value === "string") {
    value = parseInt(value);
  }
  //đảm bảo 10 lí tự sdt và thêm 0 đầu
  return value.toString().padStart(10, "0");
}

const NguoiDungSchema = new Schema({
  loaitaikhoan: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  // 0 - NguoiDung
  // 1 - Admin
  matkhau: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/\S+@\S+\.\S+/, "Email không hợp lệ"],
  },
  ten: {
    type: String,
  },
  gioitinh: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  // 0 - Nam
  // 1 - Nữ
  avt: {
    type: String,
  },
  ngaysinh: {
    type: Date,
  },
  sdt: {
    type: String,
    unique: true,
    required: true,
    set: format,
  },
  ngaytao: {
    type: Date,
    default: Date.now,
  },
  id_gmail: {
    type: String,
    unique: true, // Đảm bảo ID Gmail là duy nhất
  },
  id_hienthi: {
    type: Boolean,
    default: true,
    required: true,
  },
});

// Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
NguoiDungSchema.pre("save", async function (next) {
  if (!this.isModified("matkhau")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.matkhau = await bcrypt.hash(this.matkhau, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

const NguoiDungModel = mongoose.model("NguoiDung", NguoiDungSchema);

module.exports = NguoiDungModel;
