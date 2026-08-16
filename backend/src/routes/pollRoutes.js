import { Router } from "express";

import {
  closePoll,
  createPoll,
  listPolls,
  votePoll,
} from "../controllers/pollController.js";

import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

// Get all polls for a trip
router
  .route("/:tripId")
  .get(listPolls)
  .post(createPoll);

// Vote on a poll
router.post(
  "/:tripId/:pollId/vote",
  votePoll
);

// Close a poll
router.patch(
  "/:tripId/:pollId/close",
  closePoll
);

export default router;