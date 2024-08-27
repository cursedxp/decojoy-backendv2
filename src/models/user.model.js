import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  concepts: {
    type: [String],
    default: [],
  },
  likes: {
    type: [String],
    default: [],
  },
  role: {
    type: String,
    enum: ["user", "admin", "partner"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "active",
  },
});

const User = model("User", userSchema);
export default User;
