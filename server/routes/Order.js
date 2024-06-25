import express from "express";
import OrderModel from "../models/Order/OrderModel.js";

const routerOrder = express.Router();

// Kiểm tra trùng lặp đơn hàng
routerOrder.post("/check-duplicate", async (req, res, next) => {
  try {
    const { id_order } = req.body;
    const existingOrder = await OrderModel.findOne({ id_order });

    if (existingOrder) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    return next(error);
  }
});

// Lấy danh sách đơn hàng
routerOrder.get("/list", async (req, res, next) => {
  try {
    const listOrders = await OrderModel.find({});
    res.json({ success: true, data: listOrders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Thêm đơn hàng mới
routerOrder.post("/add", async (req, res, next) => {
  try {
    const { id_order, customer, items, total_price, order_date, status } =
      req.body;

    const newOrder = {
      id_order,
      customer,
      items,
      total_price,
      order_date,
      status,
    };
    await OrderModel.create(newOrder);

    res.json({ status: 1, message: "Thêm đơn hàng thành công" });
  } catch (err) {
    console.error("Error adding order:", err);
    res.json({ status: 0, message: "Thêm đơn hàng thất bại" });
  }
});

// Xóa đơn hàng
routerOrder.delete("/:id_order", async (req, res, next) => {
  try {
    const { id_order } = req.params;
    await OrderModel.deleteOne({ id_order });
    res.json({ status: 1, message: "Xóa đơn hàng thành công" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.json({ status: 0, message: "Xóa đơn hàng thất bại" });
  }
});

// Cập nhật đơn hàng
routerOrder.put("/:id_order", async (req, res, next) => {
  try {
    const { id_order } = req.params;
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { id_order },
      req.body,
      {
        new: true,
      }
    );
    res.json({
      status: 1,
      message: "Cập nhật đơn hàng thành công",
      updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.json({ status: 0, message: "Cập nhật đơn hàng thất bại" });
  }
});

export default routerOrder;
