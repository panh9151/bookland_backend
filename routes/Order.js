import express from "express";
import OrderModel from "../models/Order/OrderModel.js";

const routerOrder = express.Router();

// Tạo đơn hàng mới
routerOrder.post("/add", async (req, res) => {
  const {
    id_user,
    diachi,
    sdt,
    nguoinhan,
    phuongthucthanhtoan,
    ghichu,
    order_date,
    status,
    thanhtoan,
  } = req.body;
  try {
    const newOrder = new OrderModel({
      id_user,
      diachi,
      sdt,
      nguoinhan,
      phuongthucthanhtoan,
      ghichu,
      order_date,
      status,
      thanhtoan,
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cập nhật trạng thái đơn hàng
routerOrder.put("/status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lấy thông tin đơn hàng
routerOrder.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lấy danh sách tất cả đơn hàng
routerOrder.get("/list", async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default routerOrder;
