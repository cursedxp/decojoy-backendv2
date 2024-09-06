import { jwt } from "../config/index.js";
import { User } from "../models/index.js";

const auth = async (req, res, next) => {
  const token = req.cookies.auth;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.userRole = user.role;

    next();
  } catch (error) {
    // Log the error for debugging
    console.error("Token verification failed:", error);

    // If the token is expired, return a specific message
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token has expired", error: error.message });
    }

    // For other token-related errors, return a generic message
    res
      .status(401)
      .json({ message: "Token is not valid", error: error.message });
  }
};

export default auth;
