import { mongoose } from "../config/index.js";
import { Room } from "../models/index.js";

// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Get a single room
const getRoom = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "No room with that id" });
  try {
    const room = await Room.findById(id);
    res.status(200).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a room
const createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const newRoom = await Room.create({ name });
    res.status(200).json(newRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a room
const updateRoom = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "No room with that id" });
  try {
    const { name } = req.body;
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Delete a room
const deleteRoom = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "No room with that id" });

  try {
    await Room.findByIdAndDelete(id);
    res.status(200).json({ message: "Room has been deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { createRoom, getAllRooms, getRoom, updateRoom, deleteRoom };
