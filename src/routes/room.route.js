import { Router } from "express";
import { roomController } from "../controllers/index.js";
const router = Router();

// Get all rooms
router.get("/", roomController.getAllRooms);

// Create a room
router.post("/", roomController.createRoom);

// Get a single room
router.get("/:id", roomController.getRoom);

// Update a room
router.put("/:id", roomController.updateRoom);

// Delete a room
router.delete("/:id", roomController.deleteRoom);

export default router;
