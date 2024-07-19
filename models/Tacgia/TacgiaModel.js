const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TacgiaSchema = new Schema({
  ten: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  tieusu: {
    type: String,
  },
  id_hienthi: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const TacgiaModel = mongoose.model("Tacgia", TacgiaSchema);
module.exports = TacgiaModel;
