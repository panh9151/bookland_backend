import express, { Router } from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import routerAdmin from "./routes/Admin.js";
import routerNguoiDung from "./routes/NguoiDung.js";
import routerSach from "./routes/Sach.js";
import routerSachDetail from "./routes/SachDetail.js";
import routerTacgia from "./routes/Tacgia.js";
import routerBanner from "./routes/Banner.js";
import routerDanhGia from "./routes/DanhGia.js";
import routerDonHang from "./routes/DonHang.js";
import routerTheLoaiSach from "./routes/TheLoaiSach.js";
import routerTheLoaiDetail from "./routes/TheLoaiDetail.js";
import routerAuth from "./routes/Auth.js";
import routerBaiViet from "./routes/BaiViet.js";
import routerBinhLuan from "./routes/BinhLuan.js";
import routerChiTietDonHang from "./routes/ChiTietDonHang.js";
import routerTheLoaiBaiViet from "./routes/TheLoaiBaiViet.js";

//app config
const app = express();
const port = 8181;
// khai bao thu viện

//middleware
app.use(express.json());
app.use(cors());

//db connect
connectDB();
app.get("/", (req, res) => {
  res.send("API Working");
});

// app.use("/api/add, routerSach");
app.use("/api/admin", routerAdmin);
app.use("/api/nguoidung", routerNguoiDung);
app.use("/api/sach", routerSach);
app.use("/api/chitietsach", routerSachDetail);
app.use("/api/tacgia", routerTacgia);
app.use("/api/banner", routerBanner);
app.use("/api/danhgia", routerDanhGia);
app.use("/api/donhang", routerDonHang);
app.use("/api/theloai", routerTheLoaiSach);
app.use("/api/chitiettheloai", routerTheLoaiDetail);
app.use("/api/auth", routerAuth);
app.use("/api/baiviet", routerBaiViet);
app.use("/api/binhluan", routerBinhLuan);
app.use("/api/chitietdonhang", routerChiTietDonHang);
app.use("/api/theloaibaiviet", routerTheLoaiBaiViet);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
