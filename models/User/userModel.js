import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  loaitaikhoan: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  // 0 - User
  // 1 - Admin
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
    type: Number,
  },

  ngaytao: {
    type: Date,
    default: Date.now,
  },
  id_gmail: {
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
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const UserModel = mongoose.model("User", UserSchema);
//const SachModel = mongoose.model("Sach", SachSchema);
export default UserModel;
// export default SachModel;
