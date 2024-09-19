import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    displayName: {
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
          type: Schema.Types.ObjectId,
          ref: "Product",
          likedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      concepts: [
        {
          type: Schema.Types.ObjectId,
          ref: "Concept",
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
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);
export default User;
