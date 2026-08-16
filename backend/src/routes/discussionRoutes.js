import { Router } from "express";

import {
  createMessage,
  deleteMessage,
  listMessages,
} from "../controllers/discussionController.js";

import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

// Get all discussion messages for a trip
router
  .route("/:tripId")
  .get(listMessages)
  .post(createMessage);

// Delete your own message
router.delete(
  "/:tripId/:messageId",
  deleteMessage
);

export default router;