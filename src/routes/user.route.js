import { Router } from "express";
import { userController } from "../controllers/index.js";

const router = Router();

// Get all users
router.get("/", userController.getAllUsers);

// Get user by id
router.get("/:id", userController.getUserById);

// Create a new user
router.post("/", userController.createUser);

// Update a user
router.put("/:id", userController.updateUser);

export default router;
