import { Router } from "express";
import {
  createSchedule,
  deleteSchedule,
  listSchedules,
  updateSchedule,
} from "../controllers/scheduleController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router
  .route("/:tripId")
  .get(listSchedules)
  .post(createSchedule);

router
  .route("/:tripId/:scheduleId")
  .patch(updateSchedule)
  .delete(deleteSchedule);

export default router;