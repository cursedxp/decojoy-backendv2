import { Router } from "express";
import { conceptController } from "../controllers/index.js";
import auth from "../middlewares/auth.js";
import roleAuth from "../middlewares/roleAuth.js";
const router = Router();

//Get all concepts
router.get("/", conceptController.getAllConcepts);

//Get a concept by id
router.get("/:id", conceptController.getConceptById);

//Create a concept
router.post("/", auth, roleAuth(["admin"]), conceptController.createConcept);

//Update a concept
router.put("/:id", auth, roleAuth(["admin"]), conceptController.updateConcept);

//Delete a concept
router.delete(
  "/:id",
  auth,
  roleAuth(["admin"]),
  conceptController.deleteConcept
);

//Add product to concept
router.post(
  "/:conceptId/products",
  auth,
  roleAuth(["admin"]),
  conceptController.addProductToConcept
);

//Remove product from concept
router.delete(
  "/:conceptId/products",
  auth,
  roleAuth(["admin"]),
  conceptController.removeProductFromConcept
);

export default router;
