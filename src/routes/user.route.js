import { Router } from "express";
import { userController } from "../controllers/index.js";
import auth from "../middlewares/auth.js";
import roleAuth from "../middlewares/roleAuth.js";

const router = Router();

//login user
router.post("/signin", userController.loginUser);

// Get current user
router.get("/current", auth, userController.getCurrentUser);

// Get all users
router.get("/", auth, roleAuth(["admin"]), userController.getAllUsers);

// Get user by id
router.get("/:id", userController.getUserById);

// Create a new user
router.post("/", userController.createUser);

// Update a user
router.put("/:id", auth, userController.updateUser);

// Like a product
router.post("/like", auth, userController.likeProduct);

// Unlike a product
router.post("/unlike", auth, userController.unlikeProduct);

// Check if a user has liked a product
router.post("/hasLiked", auth, userController.hasLikedProduct);

export default router;
