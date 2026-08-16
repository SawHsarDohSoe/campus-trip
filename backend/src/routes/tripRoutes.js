import { Router } from "express";
import {
  createTrip,
  deleteTrip,
  getTrip,
  joinTrip,
  listTrips,
  listTripHistory,
  updateTrip,
} from "../controllers/tripController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.route("/").get(listTrips).post(createTrip);

router.route("/history").get(listTripHistory);

router.post("/join", joinTrip);


router
  .route("/:id")
  .get(getTrip)
  .patch(updateTrip)
  .delete(deleteTrip);

export default router;
