import { Router } from "express";
import { productController } from "../controllers/index.js";
import auth from "../middlewares/auth.js";
const router = Router();

//Get all products
router.get("/", productController.getAllProducts);

//Get a product by id
router.get("/:id", productController.getProductById);

//Create a product
router.post("/", auth, productController.createProduct);

//Update a product
router.put("/:id", auth, productController.updateProduct);

//Delete a product
router.delete("/:id", auth, productController.deleteProduct);

export default router;
