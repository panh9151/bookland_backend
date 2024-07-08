import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;
function format(value) {
  if (typeof value === "string") {
    value = parseInt(value);
  }
  if (value.toString().length === 9) {
    return "0" + value;
  }
  return value;
}

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
    // You can add more specific validation if needed, e.g., match: /regex/
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
    set: format,
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
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
