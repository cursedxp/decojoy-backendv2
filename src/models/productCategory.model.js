import { Schema, model } from "mongoose";

const productCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ProductCategory = model("ProductCategory", productCategorySchema);
export default ProductCategory;
