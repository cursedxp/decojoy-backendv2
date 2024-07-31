import { Router } from "express";
import { productController } from "../controllers/index.js";
const router = Router();

//Search products
router.get("/search", productController.searchProduct);
//Get all products
router.get("/", productController.getAllProducts);

//Get a product by id
router.get("/:id", productController.getProductById);

//Create a product
router.post("/", productController.createProduct);

//Update a product
router.put("/:id", productController.updateProduct);

//Delete a product
router.delete("/:id", productController.deleteProduct);

export default router;
