import mongoose from "mongoose";
import { User, Product } from "../models/index.js";

const likeProduct = async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid productId" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findOne({
      _id: userId,
      "likes.products": productId,
    });

    if (user) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "User has already liked the product" });
    }

    const userUpdateResult = await User.updateOne(
      { _id: userId },
      {
        $push: {
          "likes.products": new mongoose.Types.ObjectId(productId),
        },
      },
      { session }
    );
    const productUpdateResult = await Product.updateOne(
      { _id: productId },
      {
        $addToSet: { likedBy: userId },
        $inc: { totalLikes: 1 },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Product liked successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error liking product:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const unlikeProduct = async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId;

  if (
    !mongoose.Types.ObjectId.isValid(productId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return res.status(400).json({ message: "Invalid productId or userId" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findOne({
      _id: userId,
      "likes.products": productId,
    });

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "User has not liked the product" });
    }

    const userUpdateResult = await User.updateOne(
      { _id: userId },
      { $pull: { "likes.products": new mongoose.Types.ObjectId(productId) } },
      { session }
    );

    const productUpdateResult = await Product.updateOne(
      { _id: productId },
      {
        $pull: { likedBy: userId },
        $inc: { totalLikes: -1 },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Product unliked successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error unliking product:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const hasLikedProduct = async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hasLiked = user.likes.products.some(
      (likedProductId) => likedProductId.toString() === productId
    );
    return res.status(200).json({ hasLiked });
  } catch (error) {
    console.error("Error checking if user has liked product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { likeProduct, unlikeProduct, hasLikedProduct };
