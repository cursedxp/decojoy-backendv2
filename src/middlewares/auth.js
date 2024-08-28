import { jwt } from "../config/index.js";

const auth = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header("Authorization")?.split(" ")[1];

  // Check if the token exists
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set the user ID and role on the request object
    req.userId = decoded.user.id;
    req.userRole = decoded.user.role;

    // Call the next middleware
    next();
  } catch (error) {
    // If the token is not valid, return a 401 error
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
