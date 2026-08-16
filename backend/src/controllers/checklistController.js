import ChecklistItem from "../models/ChecklistItem.js";
import Trip from "../models/Trip.js";

export async function listChecklistItems(request, response, next) {
  try {
    const { tripId } = request.query;

    const filter = {
      owner: request.user._id,
    };

    if (tripId) {
      filter.trip = tripId;
    }

    const items = await ChecklistItem.find(filter).sort({
      createdAt: 1,
    });

    response.json({ items });
  } catch (error) {
    next(error);
  }
}

export async function createChecklistItem(request, response, next) {
  try {
    const { tripId, label } = request.body;

    const trip = await Trip.findOne({
      _id: tripId,
      owner: request.user._id,
    });

    if (!trip) {
      return response.status(404).json({
        message: "Trip not found.",
      });
    }

    const item = await ChecklistItem.create({
      owner: request.user._id,
      trip: trip._id,
      label,
      completed: false,
    });

    return response.status(201).json({ item });
  } catch (error) {
    return next(error);
  }
}

export async function updateChecklistItem(request, response, next) {
  try {
    const item = await ChecklistItem.findOne({
      _id: request.params.id,
      owner: request.user._id,
    });

    if (!item) {
      return response.status(404).json({
        message: "Checklist item not found.",
      });
    }

    if (request.body.label !== undefined) {
      item.label = request.body.label;
    }

    if (request.body.completed !== undefined) {
      item.completed = request.body.completed;
    }

    await item.save();

    return response.json({ item });
  } catch (error) {
    return next(error);
  }
}

export async function deleteChecklistItem(request, response, next) {
  try {
    const item = await ChecklistItem.findOne({
      _id: request.params.id,
      owner: request.user._id,
    });

    if (!item) {
      return response.status(404).json({
        message: "Checklist item not found.",
      });
    }

    await item.deleteOne();

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}