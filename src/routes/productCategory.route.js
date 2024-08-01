import { Router } from "express";
import { productCategoryController } from "../controllers/index.js";

const router = Router();
// Get all product categories
router.get("/", productCategoryController.getAllProductCategories);

// Get product category by id
router.get("/:id", productCategoryController.getProductCategoryById);

// Create a new product category
router.post("/", productCategoryController.createProductCategory);

// Update a product category
router.put("/:id", productCategoryController.updateProductCategory);

// Delete a product category
router.delete("/:id", productCategoryController.deleteProductCategory);

export default router;
