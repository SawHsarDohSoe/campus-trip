import { Router } from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.get("/", getSettings);
router.patch("/", updateSettings);

export default router;