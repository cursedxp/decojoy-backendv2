import { mongoose } from "../config/index.js";
import { Style } from "../models/index.js";

//Get all styles
const getAllStyles = async (req, res) => {
  try {
    const styles = await Style.find().sort({ createdAt: -1 });
    res.status(200).json(styles);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Get a single style
const getStyle = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "No style with that id" });

  try {
    const style = await Style.findById(id);
    if (!style)
      return res.status(404).json({ message: "No style with that id" });
    res.status(200).json(style);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Create a style
const createStyle = async (req, res) => {
  try {
    const { name } = req.body;
    const newStyle = await Style.create({ name });
    res.status(200).json(newStyle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Update a style
const updateStyle = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedStyle = await Style.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    res.status(200).json(updatedStyle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Delete a style
const deleteStyle = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "No style with that id" });
  try {
    await Style.findByIdAndDelete(id);
    res.status(200).json({ message: "Style deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getAllStyles, getStyle, createStyle, updateStyle, deleteStyle };
