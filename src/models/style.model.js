import { Schema, model } from "../config";

const styleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Style = model("Style", styleSchema);
export default Style;
