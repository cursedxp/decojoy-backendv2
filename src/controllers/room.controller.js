import { Room } from "../models/index.js";

// Get all rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Get a single room
const getRoom = async (req, res) => {
  try {
    const { id } = req.params;
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
  try {
    const { id } = req.params;
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
  try {
    const { id } = req.params;
    await Room.findByIdAndDelete(id);
    res.status(200).json({ message: "Room has been deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { createRoom, getRooms, getRoom, updateRoom, deleteRoom };
