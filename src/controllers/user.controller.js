import { User, Product } from "../models/index.js";
import { jwt } from "../config/index.js";
import mongoose from "mongoose";
import argon2 from "argon2";

//login user
const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from 'strict' to 'lax'
      maxAge: 3600000, // 1 hour
    });

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || null,
      },
      status: "success",
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    // Parse query parameters
    const { all, page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const startIndex = (parsedPage - 1) * parsedLimit;

    // Initialize query object
    let query = {};
    // If all is true, return all users
    if (all === "true") {
      const users = await User.find(query);
      return res.status(200).json(users);
    }

    // Count total number of users matching the query
    const totalUsers = await User.countDocuments(query);

    // Fetch users with pagination
    const users = await User.find(query).skip(startIndex).limit(parsedLimit);

    // Create pagination info object
    const paginationInfo = {
      currentPage: parsedPage,
      itemsPerPage: parsedLimit,
      totalItems: totalUsers,
      totalPages: Math.ceil(totalUsers / parsedLimit),
      hasNextPage: startIndex + parsedLimit < totalUsers,
      hasPrevPage: parsedPage > 1,
    };

    // Send response with users and pagination info
    return res.status(200).json({ users, paginationInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get a user by id
const getUserById = async (req, res) => {
  const id = req.userId;
  const allowedRole = req.allowedRole;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "User not found." });
  }
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (allowedRole !== "admin") {
      return res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
        },
        status: "success",
      });
    }
    return res.status(200).json({ user, status: "success" });
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({ message: error.message });
  }
};

//Get user's likes
const getUsersLikes = async (req, res) => {
  const userId = req.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId)
      .populate("likes.products")
      .populate("likes.concepts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      likes: {
        products: user.likes.products,
        concepts: user.likes.concepts,
      },
      status: "success",
      message: "User likes retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting user's likes:", error);
    res.status(500).json({ message: error.message, status: "error" });
  }
};

//Create a new user
const createUser = async (req, res) => {
  try {
    //Get the user data from the request body
    const { name, email, password } = req.body;

    //Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //Hash the password
    const hashedPassword = await argon2.hash(password);

    //Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    if (!newUser) {
      return res.status(400).json({ message: "Failed to create user" });
    }
    //Return the new user
    return res.status(201).json({
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      status: "success",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: error.message });
  }
};

//Update a user
const updateUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, password, profilePicture } = req.body;

    //Check if the user id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Update the user
    user.name = name;
    user.email = email;
    user.profilePicture = profilePicture;

    //Update the password if it is provided
    if (password) {
      user.password = await argon2.hash(password);
    }
    //Save the user
    await user.save();

    //Return the updated user
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
};

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

export {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  signInUser,
  getUsersLikes,
};
