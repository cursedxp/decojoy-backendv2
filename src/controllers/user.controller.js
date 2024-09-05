import { User, Product } from "../models/index.js";
import { jwt } from "../config/index.js";
import mongoose from "mongoose";
import argon2 from "argon2";

//login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user exists
    const user = await User.findOne({ email });

    //if user does not exist, return a 404 error
    if (!user) return res.status(404).json({ message: "User not found" });

    //check if password is correct
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    //create payload with user id
    const payload = { id: user._id };

    //generate jwt token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        return res.status(200).json({ token });
      }
    );
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      role: user.role,
    });
  } catch (error) {
    console.error("Error getting current user:", error);
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
  // Get the user id from the request parameters
  const { id } = req.params;
  // Check if the user id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "User not found." });
  }
  // Find the user by id
  const user = await User.findById(id);
  // If the user is not found, return a 404 error
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  // Return the user
  return res.status(200).json(user);
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
    const newUser = User.create({
      name,
      email,
      password: hashedPassword,
    });

    //Return the new user
    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: error.message });
  }
};

//Update a user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
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

//Like a product
const likeProduct = async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId; // This should be set by your auth middleware

  // Validate productId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid productId" });
  }
  //Start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //Update the user's liked products
    const userUpdate = await User.updateOne(
      { _id: userId },
      {
        $addToSet: {
          "likes.products": {
            product: productId,
            likedAt: new Date(),
          },
        },
      },
      { session }
    );

    //If the user has already liked the product, abort the transaction
    if (userUpdate.nModified === 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "User has already liked the product" });
    }

    //Update the product's likedBy and totalLikes
    await Product.updateOne(
      { _id: productId },
      {
        $addToSet: { likedBy: userId },
        $inc: { totalLikes: 1 },
      },
      { session }
    );

    //Commit the transaction
    await session.commitTransaction();
    session.endSession();

    //Return a success message
    return res.status(200).json({ message: "Product liked and updated" });
  } catch (error) {
    //Abort the transaction
    await session.abortTransaction();
    session.endSession();
    //Return an error message
    console.error("Error liking product:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
};

//Unlike a product
const unlikeProduct = async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId;
  // Validate productId and userId
  if (
    !mongoose.Types.ObjectId.isValid(productId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return res.status(400).json({ message: "Invalid productId or userId" });
  }

  //Start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //Update the user's liked products
    const userUpdate = await User.updateOne(
      { _id: userId },
      { $pull: { "likes.products": { product: productId } } },
      { session }
    );

    //If the user has not liked the product, abort the transaction
    if (userUpdate.nModified === 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "User has not liked the product" });
    }

    //Update the product's likedBy and totalLikes
    await Product.updateOne(
      { _id: productId },
      {
        $pull: { likedBy: userId },
        $inc: { totalLikes: -1 },
      },
      { session }
    );

    //Commit the transaction
    await session.commitTransaction();
    session.endSession();

    //Return a success message
    return res.status(200).json({ message: "Product unliked and updated" });
  } catch (error) {
    //Abort the transaction
    await session.abortTransaction();
    session.endSession();
    //Return an error message
    console.error("Error unliking product:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
};
//check if a user has liked a product
const hasLikedProduct = async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    const hasLiked = user.likes.products.some(
      (like) => like.product.toString() === productId
    );
    return res.status(200).json({ hasLiked });
  } catch (error) {
    console.error("Error checking if user has liked product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  loginUser,
  getCurrentUser,
  likeProduct,
  unlikeProduct,
  hasLikedProduct,
};
