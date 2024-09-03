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
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    totalLikes: {
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
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
const Product = model("Product", productSchema);
export default Product;
