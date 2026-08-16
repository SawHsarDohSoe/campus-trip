import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  listExpenses,
  updateExpense,
} from "../controllers/expenseController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router
  .route("/")
  .get(listExpenses)
  .post(createExpense);

router
  .route("/:id")
  .patch(updateExpense)
  .delete(deleteExpense);

export default router;