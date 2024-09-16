import { Router } from "express";
import { userController } from "../controllers/index.js";
import auth from "../middlewares/auth.js";
import roleAuth from "../middlewares/roleAuth.js";

const router = Router();

//login user
router.post("/signin", userController.signInUser);

// Get all users
router.get("/", auth, roleAuth(["admin"]), userController.getAllUsers);

// Get user by id
router.get("/:id", auth, userController.getUserById);

// Create a new user
router.post("/", userController.createUser);

// Get user's likes
router.get("/:id/likes", auth, userController.getUsersLikes);

// Update a user
router.put("/:id", auth, userController.updateUser);

// Sign out user
router.post("/signout", (req, res) => {
  res.clearCookie("auth");
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
