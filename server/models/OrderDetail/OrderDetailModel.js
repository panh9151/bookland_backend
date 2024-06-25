const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderDetailSchema = new Schema({
  id_orderdetail: {
    type: String,
    unique: true,
    required: true,
  },
  id_loaisach: {
    type: String,
    ref: "LoaiSach",
    required: true,
  },
  id_order: {
    type: String,
    ref: "Order",
    required: true,
  },
});

module.exports =
  mongoose.models.OrderDetail ||
  mongoose.model("OrderDetail", OrderDetailSchema);
