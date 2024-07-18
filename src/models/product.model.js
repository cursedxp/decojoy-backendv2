import { Schema, model } from "mongoose";

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: false,
  },
  image: {
    type: String,
    required: true,
  },
  like: {
    type: Number,
    default: 0,
  },
  dimentions: {
    type: String,
    required: false,
  },
  link: {
    type: String,
    required: true,
  },
});
const Product = model("Product", productSchema);
export default Product;
