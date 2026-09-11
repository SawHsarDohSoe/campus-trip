import Expense from "../models/Expense.js";
import { getTripAccess } from "../utils/tripAccess.js";

export async function listExpenses(request, response, next) {
  try {
    const { tripId } = request.query;

    const filter = { owner: request.user._id };

    if (tripId) {
      const { trip, isMember } = await getTripAccess(request.user, tripId);
      if (!trip) return response.status(404).json({ message: "Trip not found." });
      if (!isMember) return response.status(403).json({ message: "You are not a member of this trip." });
      filter.trip = tripId;
      delete filter.owner;
    }

    const expenses = await Expense.find(filter)
      .sort({ date: -1 });

    response.json({ expenses });
  } catch (error) {
    next(error);
  }
}

export async function createExpense(request, response, next) {
  try {
    const {
      tripId,
      name,
      category,
      amount,
      date,
    } = request.body;

    const { trip, isMember } = await getTripAccess(request.user, tripId);

    if (!trip) {
      return response.status(404).json({
        message: "Trip not found.",
      });
    }
    if (!isMember) return response.status(403).json({ message: "You are not a member of this trip." });

    const expense = await Expense.create({
      owner: request.user._id,
      trip: trip._id,
      name,
      category,
      amount,
      date,
    });

    return response.status(201).json({
      expense,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteExpense(request, response, next) {
  try {
    const expense = await Expense.findOne({
      _id: request.params.id,
      owner: request.user._id,
    });

    if (!expense) {
      return response.status(404).json({
        message: "Expense not found.",
      });
    }

    await expense.deleteOne();

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}

export async function updateExpense(request, response, next) {
  try {
    const expense = await Expense.findOne({
      _id: request.params.id,
      owner: request.user._id,
    });

    if (!expense) {
      return response.status(404).json({
        message: "Expense not found.",
      });
    }

    const allowedFields = [
      "name",
      "category",
      "amount",
      "date",
    ];

    allowedFields.forEach((field) => {
      if (request.body[field] !== undefined) {
        expense[field] = request.body[field];
      }
    });

    await expense.save();

    return response.json({
      expense,
    });
  } catch (error) {
    return next(error);
  }
}
