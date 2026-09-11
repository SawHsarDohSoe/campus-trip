import ChecklistItem from "../models/ChecklistItem.js";
import { getTripAccess } from "../utils/tripAccess.js";

export async function listChecklistItems(request, response, next) {
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

    const items = await ChecklistItem.find(filter)
      .sort({ createdAt: 1 })
      .lean();

    // Support checklist records created by earlier frontend versions that
    // stored their text as `task` or `name` before the API standardised on `label`.
    response.json({
      items: items.map((item) => ({
        ...item,
        label: item.label || item.task || item.name || "Untitled checklist item",
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function createChecklistItem(request, response, next) {
  try {
    const { tripId, label } = request.body;

    const { trip, isMember } = await getTripAccess(request.user, tripId);

    if (!trip) {
      return response.status(404).json({
        message: "Trip not found.",
      });
    }
    if (!isMember) return response.status(403).json({ message: "You are not a member of this trip." });

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
    const item = await ChecklistItem.findById(request.params.id);

    if (!item) {
      return response.status(404).json({
        message: "Checklist item not found.",
      });
    }

    const { isMember } = await getTripAccess(request.user, item.trip);
    if (!isMember) {
      return response.status(403).json({ message: "You are not a member of this trip." });
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
    const item = await ChecklistItem.findById(request.params.id);

    if (!item) {
      return response.status(404).json({
        message: "Checklist item not found.",
      });
    }

    const { isMember } = await getTripAccess(request.user, item.trip);
    if (!isMember) {
      return response.status(403).json({ message: "You are not a member of this trip." });
    }

    await item.deleteOne();

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}
