import { Router } from "express";
import { conceptController } from "../controllers/index.js";

const router = Router();

//Get search concept
router.get("/search", conceptController.searchConcept);

//Get all concepts
router.get("/", conceptController.getAllConcepts);

//Get a concept by id
router.get("/:id", conceptController.getConceptById);

//Create a concept
router.post("/", conceptController.createConcept);

//Update a concept
router.put("/:id", conceptController.updateConcept);

//Delete a concept
router.delete("/:id", conceptController.deleteConcept);

//Add product to concept
router.post("/:conceptId/products", conceptController.addProductToConcept);

//Remove product from concept
router.delete(
  "/:conceptId/products",
  conceptController.removeProductFromConcept
);

export default router;
