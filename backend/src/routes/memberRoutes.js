import { Router } from "express";
import {
  createMember,
  deleteMember,
  listMembers,
  updateMember,
} from "../controllers/memberController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router
  .route("/")
  .get(listMembers)
  .post(createMember);

router
  .route("/:id")
  .patch(updateMember)
  .delete(deleteMember);

export default router;