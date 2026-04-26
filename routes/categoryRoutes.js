import { Router } from "express";
import {
  listCategories,
  getCategory,
  addCategory,
  editCategory,
  removeCategory,
} from "../controller/categoryController.js";
import {
  createCategoryValidation,
  updateCategoryValidation,
} from "../validation/categoryValidation.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", listCategories);
router.get("/:id", getCategory);
router.post("/", auth, createCategoryValidation, addCategory);
router.put("/:id", auth, updateCategoryValidation, editCategory);
router.delete("/:id", auth, removeCategory);

export default router;