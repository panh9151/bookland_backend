const mongoose = require("mongoose");

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

module.exports = TheLoaiBaiVietModel;
