const cors = require("cors");
const connectDB = require("./config/db.js");
const routerAdmin = require("./routes/Admin.js");
const routerNguoiDung = require("./routes/NguoiDung.js");
const routerSach = require("./routes/Sach.js");
const routerSachDetail = require("./routes/SachDetail.js");
const routerTacgia = require("./routes/Tacgia.js");
const routerBanner = require("./routes/Banner.js");
const routerDanhGia = require("./routes/DanhGia.js");
const routerDonHang = require("./routes/DonHang.js");
const routerTheLoaiSach = require("./routes/TheLoaiSach.js");
const routerTheLoaiDetail = require("./routes/TheLoaiDetail.js");
const routerAuth = require("./routes/Auth.js");
const routerBaiViet = require("./routes/BaiViet.js");
const routerBinhLuan = require("./routes/BinhLuan.js");
const routerChiTietDonHang = require("./routes/ChiTietDonHang.js");
const routerTheLoaiBaiViet = require("./routes/TheLoaiBaiViet.js");
const routerSachYeuThich = require("./routes/SachYeuThich.js");
var express = require("express");
var path = require("path");
// var cors = require("cors");
var router = express.Router();
var logger = require("morgan");
var createError = require("http-errors");
var cookieParser = require("cookie-parser");

// Library declaration
const mongoose = require("mongoose");
// require("./models/UserModel");
// require("./models/CategoryModel");

//Connect database
mongoose
  .connect(
    process.env.DB_URL,
    // "mongodb+srv://panh9151:furnito123@furnito.8i9doe9.mongodb.net/furnito",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log(">>>>>>>>>> DB Connected!!!!!!"))
  .catch((err) => console.log(">>>>>>>>> DB Error: ", err));

// var clientRouter = require("./routes/api");

var app = express();
const port = process.env.PORT;

//middleware
app.use(express.json());
app.use(cors());

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

//db connect
connectDB();
app.get("/", (req, res) => {
  res.send("API Working");
});

app.use(logger("dev"));
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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
app.use("/api/sachyeuthich", routerSachYeuThich);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// app.listen(port, () => {
//   console.log(`Server started on http://localhost:${port}`);
// });

module.exports = app;
