import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TacgiaSchema = new Schema({
  id_tacgia: {
    type: String,
    unique: true,
    required: true,
  },
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
  is_active: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const TacgiaModel = mongoose.model("Tacgia", TacgiaSchema);
export default TacgiaModel;
