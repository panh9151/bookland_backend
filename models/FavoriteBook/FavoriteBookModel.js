import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FavoritebookSchema = new Schema({
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  id_sach: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Sach",
  },
  ngaytao: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const FavoritebookModel = mongoose.model("Favoritebook", FavoritebookSchema);

export default FavoritebookModel;
