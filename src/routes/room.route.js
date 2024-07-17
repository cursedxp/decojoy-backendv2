import { Router } from "express";
import Room from "../models/index.js";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
} from "../controllers/room.controller.js";

const router = Router();
// Get all rooms
router.get("/", getRooms);

// Create a room
router.post("/", createRoom);

// Get a single room
router.get("/:id", getRoom);

// Update a room
router.put("/:id", updateRoom);

router.delete("/:id", deleteRoom);

export default router;
