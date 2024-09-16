import { Router } from "express";
import { likeController } from "../controllers/index.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/product", auth, likeController.likeProduct);
router.post("/product/unlike", auth, likeController.unlikeProduct);
router.post("/product/hasLiked", auth, likeController.hasLikedProduct);

export default router;
