import { ProductCategory } from "../models/index.js";
import mongoose from "mongoose";

// Get all product categories
const getAllProductCategories = async (req, res) => {
  try {
    const productCategories = await ProductCategory.find();
    res.status(200).json(productCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by id
const getProductCategoryById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid product category id" });
  }
  try {
    const productCategory = await ProductCategory.findById(id);
    if (!productCategory)
      return res.status(404).send({ message: "Product category not found" });
    res.status(200).json(productCategory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Create a new product category
const createProductCategory = async (req, res) => {
  const { name } = req.body;
  const productCategoryExists = await ProductCategory.findOne({ name });
  if (productCategoryExists) {
    return res.status(400).send({ message: "Product category already exists" });
  }
  try {
    const newProductCategory = await ProductCategory.create({ name });
    res.status(201).json(newProductCategory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update a product category by id
const updateProductCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid product category id" });
  }
  try {
    const updatedProductCategory = await ProductCategory.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    res.status(200).json(updatedProductCategory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a product category by id
const deleteProductCategory = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid product category id" });
  }
  try {
    await ProductCategory.findByIdAndRemove(id);
    res.status(200).json({ message: "Product category deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export {
  getAllProductCategories,
  getProductCategoryById,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
};
