const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoriteBookSchema = new Schema({
  id_favoritebook: {
    type: String,
    unique: true,
    required: true,
  },
  id_user: {
    type: String,
    required: true,
    ref: "User",
  },
  id_sach: {
    type: String,
    required: true,
    ref: "Sach",
  },
  ngaytao: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("FavoriteBook", FavoriteBookSchema);
