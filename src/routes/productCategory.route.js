import { Router } from "express";
import { productCategoryController } from "../controllers/index.js";
import auth from "../middlewares/auth.js";
import roleAuth from "../middlewares/roleAuth.js";
const router = Router();
// Get all product categories
router.get("/", productCategoryController.getAllProductCategories);

// Get product category by id
router.get("/:id", productCategoryController.getProductCategoryById);

// Create a new product category
router.post(
  "/",
  auth,
  roleAuth(["admin"]),
  productCategoryController.createProductCategory
);

// Update a product category
router.put(
  "/:id",
  auth,
  roleAuth(["admin"]),
  productCategoryController.updateProductCategory
);

// Delete a product category
router.delete(
  "/:id",
  auth,
  roleAuth(["admin"]),
  productCategoryController.deleteProductCategory
);

export default router;
