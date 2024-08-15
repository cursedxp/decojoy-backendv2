import { Product, Concept } from "../models/index.js";

import mongoose from "mongoose";

// Get all products with pagination
const getAllProducts = async (req, res) => {
  try {
    const all = req.query.all === "true";

    if (all) {
      const products = await Product.find();
      return res.status(200).json(products);
    } else {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;

      const totalProducts = await Product.countDocuments();

      const products = await Product.find().skip(startIndex).limit(limit);

      const paginationInfo = {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        hasNextPage: startIndex + limit < totalProducts,
        hasPrevPage: page > 1,
      };

      res.status(200).json({
        products,
        pagination: paginationInfo,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a product by id
const getProductById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid product id" });
  }
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).send({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Create a product
const createProduct = async (req, res) => {
  const {
    title,
    price,
    thumbnail,
    images,
    dimensions,
    link,
    description,
    category,
    colors,
    published,
    conceptId,
  } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newProduct = await Product.create(
      [
        {
          title,
          price,
          thumbnail,
          images,
          dimensions,
          link,
          description,
          category,
          colors,
          published: published || false,
        },
      ],
      { session }
    );

    if (conceptId && mongoose.Types.ObjectId.isValid(conceptId)) {
      const concept = await Concept.findById(conceptId).session(session);
      if (!concept) {
        throw new Error("Concept not found");
      }
      concept.products.push(newProduct[0]._id);
      await concept.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newProduct[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating product:", error);
    res.status(500).json({
      message: error.message || "An error occurred while creating the product.",
    });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    price,
    thumbnail,
    images,
    like,
    dimentions,
    link,
    description,
    category,
    colors,
    published,
  } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid product id" });
  }
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        title,
        price,
        thumbnail,
        images,
        like,
        dimentions,
        link,
        description,
        category,
        colors,
        published,
      },
      { new: true }
    );
    if (!product) return res.status(404).send({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid product id" });
  }
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct)
      return res.status(404).send({ message: "Product not found" });
    res.status(200).json({ message: "Product has been deleted" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
