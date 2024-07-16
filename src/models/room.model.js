import { Schema, model } from "mongoose";

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Room = model("Room", roomSchema);
export default Room;
