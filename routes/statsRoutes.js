import { Router } from "express";
import { overview, byCategory, byBrand, mostEfficient } from "../controllers/statsController.js";

const router = Router();

router.get("/", overview);
router.get("/by-category", byCategory);
router.get("/by-brand", byBrand);
router.get("/most-efficient", mostEfficient);

export default router;