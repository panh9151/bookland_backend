const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://phatltps26905:pEiPMtD1XfyF85Fy@cluster0.idfdrqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
      )
      // .connect("mongodb://localhost:27017/Bookland")
      .then(() => console.log("Kết nối data thành công"));
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
