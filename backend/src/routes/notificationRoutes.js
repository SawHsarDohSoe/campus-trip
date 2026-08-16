import { Router } from "express";

import {
  deleteNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/notificationController.js";

import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.get("/", listNotifications);

router.patch("/read-all", markAllNotificationsRead);

router.patch("/:id/read", markNotificationRead);

router.delete("/:id", deleteNotification);

export default router;