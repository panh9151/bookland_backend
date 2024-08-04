const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
// const multer = require("multer");
const router = express.Router();
const logger = require("morgan");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

var app = express();
const port = process.env.PORT;

//middleware
app.use(express.json());
app.use(cors());

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

//db connect
// connectDB();
app.get("/", (req, res) => {
  res.send("API Working");
});

// app.use(logger("dev"));
// // app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
const UserRouter = require("./routes/UserAPI");
const AuthRouter = require("./routes/AuthenAPI");
const AuthorRouter = require("./routes/AuthorAPI");
const BannerRouter = require("./routes/BannerAPI");
const BookRouter = require("./routes/BookAPI");
const CommentRouter = require("./routes/CommentAPI");
const RatingRouter = require("./routes/RatingAPI");
const OrderRouter = require("./routes/OrderAPI");
const SearchRouter = require("./routes/SearchAPI");
const BookTypeRouter = require("./routes/BookTypeAPI");

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// express.urlencoded({ extended: true });

app.use("/nguoidung", UserRouter);
app.use("/tacgia", AuthorRouter);
app.use("/banner", BannerRouter);
app.use("/auth", AuthRouter);
app.use("/sach", BookRouter);
app.use("/binhluan", CommentRouter);
app.use("/danhgia", RatingRouter);
app.use("/donhang", OrderRouter);
app.use("/theloai", BookTypeRouter);
app.use("/search", SearchRouter);

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
