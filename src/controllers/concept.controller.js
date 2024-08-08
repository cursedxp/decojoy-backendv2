import { Concept } from "../models/index.js";
import mongoose from "mongoose";

// Get all concepts with pagination
const getAllConcepts = async (req, res) => {
  const all = req.query.all === "true";
  if (all) {
    try {
      const concepts = await Concept.find()
        .populate("roomType")
        .populate("roomStyle")
        .populate("products")
        .populate("published");
      res.status(200).json({
        concepts,
        pagination: null,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    return;
  } else {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;

      const totalConcepts = await Concept.countDocuments();

      const concepts = await Concept.find()
        .populate("roomType")
        .populate("roomStyle")
        .populate("products")
        .populate("published")
        .skip(startIndex)
        .limit(limit);

      const paginationInfo = {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalConcepts,
        totalPages: Math.ceil(totalConcepts / limit),
        hasNextPage: startIndex + limit < totalConcepts,
        hasPrevPage: page > 1,
      };

      res.status(200).json({
        concepts,
        pagination: paginationInfo,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
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
      .populate("products")
      .populate("published");
    if (!concept)
      return res.status(404).json({ message: "Concept not found." });

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
    roomType,
    roomStyle,
  } = req.body;

  console.log("Request Body:", req.body);

  try {
    if (!mongoose.Types.ObjectId.isValid(roomType)) {
      return res.status(400).json({ message: "Invalid roomType ID." });
    }
    if (!mongoose.Types.ObjectId.isValid(roomStyle)) {
      return res.status(400).json({ message: "Invalid roomStyle ID." });
    }
    const roomTypeExists = await mongoose.model("Room").findById(roomType);
    const roomStyleExists = await mongoose.model("Style").findById(roomStyle);

    if (!roomTypeExists) {
      return res.status(404).json({ message: "roomType not found." });
    }
    if (!roomStyleExists) {
      return res.status(404).json({ message: "roomStyle not found." });
    }

    const newConcept = await Concept.create({
      title,
      overview,
      thumbnail,
      images,
      colors,
      like,
      roomType,
      roomStyle,
      products: [],
    });

    console.log("New Concept:", newConcept);

    res.status(201).json(newConcept);
  } catch (error) {
    console.error("Error creating concept:", error);
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
    roomType,
    roomStyle,
    published,
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
        roomType,
        roomStyle,
        published,
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
  searchConcept,
};
