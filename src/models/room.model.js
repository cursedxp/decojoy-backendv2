import { Schema, model } from "../config";

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Room = model("Room", roomSchema);
export default Room;
