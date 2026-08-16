import { Router } from "express";
import {
  createChecklistItem,
  deleteChecklistItem,
  listChecklistItems,
  updateChecklistItem,
} from "../controllers/checklistController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router
  .route("/")
  .get(listChecklistItems)
  .post(createChecklistItem);

router
  .route("/:id")
  .patch(updateChecklistItem)
  .delete(deleteChecklistItem);

export default router;