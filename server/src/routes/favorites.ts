import { Router } from "express";
import { getFavorites, toggleFavorite } from "../controllers/favoritesController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", getFavorites);
router.post("/:productId", toggleFavorite);

export default router;
