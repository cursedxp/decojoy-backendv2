import { Router } from "express";
import { roomController } from "../controllers/index.js";
import auth from "../middlewares/auth.js";
import roleAuth from "../middlewares/roleAuth.js";
const router = Router();

// Get all rooms
router.get("/", roomController.getAllRooms);

// Create a room
router.post("/", auth, roleAuth(["admin"]), roomController.createRoom);

// Get a single room
router.get("/:id", roomController.getRoom);

// Update a room
router.put("/:id", auth, roleAuth(["admin"]), roomController.updateRoom);

// Delete a room
router.delete("/:id", auth, roleAuth(["admin"]), roomController.deleteRoom);

export default router;
