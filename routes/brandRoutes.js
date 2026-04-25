import { Router } from "express";
import {
  listBrands,
  getBrand,
  addBrand,
  editBrand,
  removeBrand,
} from "../controllers/brandController.js";
import {
  createBrandValidation,
  updateBrandValidation,
} from "../validation/brandValidation.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", listBrands);
router.get("/:id", getBrand);
router.post("/", auth, createBrandValidation, addBrand);
router.put("/:id", auth, updateBrandValidation, editBrand);
router.delete("/:id", auth, removeBrand);

export default router;