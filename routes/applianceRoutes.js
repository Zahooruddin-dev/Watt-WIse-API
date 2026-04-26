import { Router } from "express";
import {
  listAppliances,
  getAppliance,
  addAppliance,
  editAppliance,
  removeAppliance,
} from "../controller/applianceController.js";
import {
  createApplianceValidation,
  updateApplianceValidation,
} from "../validation/applianceValidation.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", listAppliances);
router.get("/:id", getAppliance);
router.post("/", auth, createApplianceValidation, addAppliance);
router.put("/:id", auth, updateApplianceValidation, editAppliance);
router.delete("/:id", auth, removeAppliance);

export default router;