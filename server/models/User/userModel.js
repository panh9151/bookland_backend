import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id_user: {
    type: String,
    unique: true,
    required: true,
  },
  loaitaikhoan: {
    type: Number,
    enum: [0, 1],
    required: true,
  },
  // 0 - User
  // 2 - Admin
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  ten: {
    type: String,
  },
  tichdiem: {
    type: Number,
    default: 0,
    required: true,
  },
  gioitinh: {
    type: Number,
    enum: [0, 1],
    required: true,
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
  },
  sdt_thanhtoan: {
    type: String,
  },
  ngaytao: {
    type: Date,
    default: Date.now,
  },
  id_google: {
    type: String,
  },
  id_facebook: {
    type: String,
  },
  is_active: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const UserModel = mongoose.model("User", UserSchema);
//const SachModel = mongoose.model("Sach", SachSchema);
export default UserModel;
// export default SachModel;
