import { Product } from "../models/index.js";
import mongoose from "mongoose";

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send({ message: error.message });
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
  const { title, price, image, link } = req.body;
  try {
    const newProduct = await Product.create({
      title,
      price,
      image,
      link,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update a product

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, price, image, like, dimentions, link } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid product id" });
  }
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { title, price, image, like, dimentions, link },
      { new: true }
    );
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
    await Product.findByIdAndDelete(id);
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
