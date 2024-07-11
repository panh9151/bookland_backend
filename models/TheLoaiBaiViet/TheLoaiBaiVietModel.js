import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TheLoaiBaiVietSchema = new Schema({
  ten: {
    type: String,
    required: true,
  },
  hienthi: {
    type: Boolean,
    default: true,
  },
});

const TheLoaiBaiVietModel = mongoose.model(
  "TheLoaiBaiViet",
  TheLoaiBaiVietSchema
);

export default TheLoaiBaiVietModel;
