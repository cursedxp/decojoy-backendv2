import { Router } from "express";
import { productController } from "../controllers/index.js";
import auth from "../middlewares/auth.js";
import roleAuth from "../middlewares/roleAuth.js";
const router = Router();

//Get all products
router.get("/", productController.getAllProducts);

//Get a product by id
router.get("/:id", productController.getProductById);

//Create a product
router.post("/", auth, roleAuth(["admin"]), productController.createProduct);

//Update a product
router.put("/:id", auth, roleAuth(["admin"]), productController.updateProduct);

//Delete a product
router.delete(
  "/:id",
  auth,
  roleAuth(["admin"]),
  productController.deleteProduct
);

export default router;
