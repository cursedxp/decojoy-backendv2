import { User } from "../models/index.js";
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
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //check if password is correct
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    //create payload with user id and email
    const payload = { id: user._id, email: user.email };

    //generate jwt token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "45m" },
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

export { getAllUsers, getUserById, createUser, updateUser, loginUser };
