import express, { Router } from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import routerSach from "./routes/Sach.js";
import routerUser from "./routes/User.js";
import routerTacgia from "./routes/Tacgia.js";
import routerBanner from "./routes/Banner.js";
import routerTheLoai from "./routes/TheLoai.js";
import routerReview from "./routes/Review.js";
import routerOrder from "./routes/Order.js";
import routerVoucher from "./routes/Voucher.js";
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
app.use("/api/User", routerUser);
app.use("/api/Sach", routerSach);
app.use("/api/tacgia", routerTacgia);
app.use("/api/banner", routerBanner);
app.use("/api/theloai", routerTheLoai);
app.use("/api/review", routerReview);
app.use("/api/order", routerOrder);
app.use("/api/voucher", routerVoucher);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
