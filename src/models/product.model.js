import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: false,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
      required: false,
    },
    like: {
      type: Number,
      default: 0,
    },
    dimensions: {
      type: String,
      required: false,
    },
    link: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    colors: {
      type: [String],
      required: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Product = model("Product", productSchema);
export default Product;
