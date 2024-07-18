import { Concept } from "../models/index.js";
import mongoose from "mongoose";

// Get all concepts
const getAllConcepts = async (req, res) => {
  try {
    const concepts = await Concept.find()
      .populate("roomType")
      .populate("roomStyle")
      .populate("products");
    res.status(200).json(concepts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a concept by id
const getConceptById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Concept not found." });
  }

  try {
    const concept = await Concept.findById(id)
      .populate("roomType")
      .populate("roomStyle")
      .populate("products");
    if (!concept) {
      return res.status(404).json({ message: "Concept not found." });
    }
    res.status(200).json(concept);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a concept
const createConcept = async (req, res) => {
  const {
    title,
    overview,
    thumbnail,
    images,
    colors,
    like,
    roomTypeId,
    roomStyleId,
  } = req.body;
  try {
    const newConcept = await Concept.create({
      title,
      overview,
      thumbnail,
      images,
      colors,
      like,
      roomType: roomTypeId,
      roomStyle: roomStyleId,
      products: [],
    });
    res.status(201).json(newConcept);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a concept
const updateConcept = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    overview,
    thumbnail,
    images,
    colors,
    roomTypeId,
    roomStyleId,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Concept not found." });
  }

  try {
    const updatedConcept = await Concept.findByIdAndUpdate(
      id,
      {
        title,
        overview,
        thumbnail,
        images,
        colors,
        roomType: roomTypeId,
        roomStyle: roomStyleId,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("roomType")
      .populate("roomStyle")
      .populate("products");

    if (!updatedConcept) {
      return res.status(404).json({ message: "Concept not found." });
    }
    res.status(200).json(updatedConcept);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a concept
const deleteConcept = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Concept not found." });
  }

  try {
    const deletedConcept = await Concept.findByIdAndDelete(id);
    if (!deletedConcept) {
      return res.status(404).json({ message: "Concept not found." });
    }
    res.status(200).json({ message: "Concept has been deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a product to a concept
const addProductToConcept = async (req, res) => {
  const { conceptId, productId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(conceptId) ||
    !mongoose.Types.ObjectId.isValid(productId)
  ) {
    return res.status(404).json({ message: "Invalid Concept or Product ID." });
  }

  try {
    const concept = await Concept.findById(conceptId);
    if (!concept) {
      return res.status(404).json({ message: "Concept not found." });
    }

    concept.products.push(productId);
    await concept.save();

    res.status(200).json(concept);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a product from a concept
const removeProductFromConcept = async (req, res) => {
  const { conceptId, productId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(conceptId) ||
    !mongoose.Types.ObjectId.isValid(productId)
  ) {
    return res.status(404).json({ message: "Invalid Concept or Product ID." });
  }

  try {
    const concept = await Concept.findById(conceptId);
    if (!concept) {
      return res.status(404).json({ message: "Concept not found." });
    }

    concept.products.pull(productId);
    await concept.save();

    res.status(200).json(concept);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllConcepts,
  getConceptById,
  createConcept,
  updateConcept,
  deleteConcept,
  addProductToConcept,
  removeProductFromConcept,
};
