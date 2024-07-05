import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderDetailSchema = new Schema({
  id_sach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sach",
    required: true,
  },
  id_order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  soluong: {
    type: Number,
    required: true,
  },
});

const OrderDetailModel = mongoose.model("OrderDetail", OrderDetailSchema);

export default OrderDetailModel;
