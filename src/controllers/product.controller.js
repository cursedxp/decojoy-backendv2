import { Product } from "../models/index.js";
import mongoose from "mongoose";

// Get all products with pagination
const getAllProducts = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Search product
const searchProduct = async (req, res) => {
  try {
    const searchTerm = req.query.search ? req.query.search.trim() : "";

    if (!searchTerm) {
      // Return an empty result if the search term is empty
      return res.status(200).json({ products: [] });
    }

    const searchQuery = {
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
      ],
    };

    const products = await Product.find(searchQuery);

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error in searchProduct:", error);
    res.status(500).json({ message: error.message, stack: error.stack });
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
    image,
    link,
    description,
    category,
    colors,
    published,
  } = req.body;
  try {
    const newProduct = await Product.create({
      title,
      price,
      image,
      link,
      description,
      category,
      colors,
      published: published || false,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    price,
    image,
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
        image,
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
  searchProduct,
};
