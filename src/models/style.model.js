import { Schema, model } from "mongoose";

const styleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Style = model("Style", styleSchema);
export default Style;
