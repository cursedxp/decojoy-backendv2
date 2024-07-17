import { Router } from "express";
import { styleController } from "../controllers/index.js";
const router = Router();

// Get all styles
router.get("/", styleController.getAllStyles);

// Create a style
router.post("/", styleController.createStyle);

// Get a single style
router.get("/:id", styleController.getStyle);

// Update a style
router.put("/:id", styleController.updateStyle);

// Delete a style
router.delete("/:id", styleController.deleteStyle);

export default router;
