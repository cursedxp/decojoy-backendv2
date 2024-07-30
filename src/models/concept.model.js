import { Schema, model } from "mongoose";

const conceptSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    overview: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    like: {
      type: Number,
      default: 0,
    },
    roomType: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    roomStyle: {
      type: Schema.Types.ObjectId,
      ref: "Style",
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Concept = model("Concept", conceptSchema);
export default Concept;
