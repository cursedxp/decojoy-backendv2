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
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    concepts: [
      {
        concept: {
          type: Schema.Types.ObjectId,
          ref: "Concept",
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  role: {
    type: String,
    enum: ["user", "admin", "proUser"],
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
