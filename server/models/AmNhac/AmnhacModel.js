const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AmNhacSchema = new Schema({
  id_amnhac: {
    type: String,
    unique: true,
    required: true,
  },
  id_sach: {
    type: Schema.Types.ObjectId,
    ref: "Sach",
    required: true,
  },
  ten: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  hien_thi: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("AmNhac", AmNhacSchema);
