import { Router } from "express";
import { styleController } from "../controllers/index.js";
import auth from "../middlewares/auth.js";
import roleAuth from "../middlewares/roleAuth.js";
const router = Router();

// Get all styles
router.get("/", styleController.getAllStyles);

// Create a style
router.post("/", auth, roleAuth(["admin"]), styleController.createStyle);

// Get a single style
router.get("/:id", styleController.getStyle);

// Update a style
router.put("/:id", auth, roleAuth(["admin"]), styleController.updateStyle);

// Delete a style
router.delete("/:id", auth, roleAuth(["admin"]), styleController.deleteStyle);

export default router;
