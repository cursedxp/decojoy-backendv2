import { Router } from "express";
import { likeController } from "../controllers/index.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/product", auth, likeController.likeProduct);
router.post("/product/unlike", auth, likeController.unlikeProduct);
router.post("/product/liked", auth, likeController.likedProduct);

router.post("/concept", auth, likeController.likeConcept);
router.post("/concept/unlike", auth, likeController.unlikeConcept);
router.post("/concept/liked", auth, likeController.likedConcept);

export default router;
