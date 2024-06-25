import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  id_order: {
    type: String,
    unique: true,
    required: true,
  },
  customer: {
    type: String,
    required: true,
  },
  items: [
    {
      product: String,
      quantity: Number,
      price: Number,
    },
  ],
  total_price: {
    type: Number,
    required: true,
  },
  order_date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Pending",
  },
});

const OrderModel = mongoose.model("Order", OrderSchema);

export default OrderModel;
