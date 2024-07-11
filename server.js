import express, { Router } from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import routerSach from "./routes/Sach.js";
import routerUser from "./routes/NguoiDung.js";
import routerAdmin from "./routes/Admin.js";
import routerTacgia from "./routes/Tacgia.js";
import routerBanner from "./routes/Banner.js";
import routerTheLoai from "./routes/TheLoai.js";
import routerReview from "./routes/DanhGia.js";
import routerOrder from "./routes/DonHang.js";
import routerTheLoaiDetail from "./routes/TheLoaiDetail.js";
import routerAuth from "./routes/Auth.js";
import routerSachDetail from "./routes/SachDetail.js";

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
app.use("/api/user", routerUser);
app.use("/api/sach", routerSach);
app.use("/api/tacgia", routerTacgia);
app.use("/api/banner", routerBanner);
app.use("/api/theloai", routerTheLoai);
app.use("/api/review", routerReview);
app.use("/api/donhang", routerOrder);
app.use("/api/chitiettheloai", routerTheLoaiDetail);
app.use("/api/auth", routerAuth);
app.use("/api/chitietsach", routerSachDetail);
app.use("/api/baiviet", routerAuth);
app.use("/api/auth", routerAuth);
app.use("/api/auth", routerAuth);
app.use("/api/auth", routerAuth);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
