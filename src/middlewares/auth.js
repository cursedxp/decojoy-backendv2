import { jwt } from "../config/index.js";
import { User } from "../models/index.js";

const auth = async (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header("Authorization")?.split(" ")[1];

  // Check if the token exists
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set the user ID
    req.userId = decoded.id;

    // Fetch the user from the database to get the role
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.userRole = user.role;

    // Call the next middleware
    next();
  } catch (error) {
    // Log the error for debugging
    console.error("Token verification failed:", error);

    // If the token is not valid, return a 401 error
    res
      .status(401)
      .json({ message: "Token is not valid", error: error.message });
  }
};

export default auth;
