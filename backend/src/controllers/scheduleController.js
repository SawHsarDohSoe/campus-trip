import Schedule from "../models/Schedule.js";
import Trip from "../models/Trip.js";
import Member from "../models/Member.js";
import Notification from "../models/Notification.js";

export async function listSchedules(request, response, next) {
  try {
    const trip = await Trip.findById(request.params.tripId);

    if (!trip) {
      return response.status(404).json({
        message: "Trip not found.",
      });
    }

    const isOwner =
      String(trip.owner) === String(request.user._id);

    if (!isOwner) {
      const member = await Member.findOne({
        trip: trip._id,
        email: request.user.email.toLowerCase(),
        status: "Confirmed",
      });

      if (!member) {
        return response.status(403).json({
          message: "You are not a member of this trip.",
        });
      }
    }

    const schedules = await Schedule.find({
      trip: trip._id,
    }).sort({
      date: 1,
      time: 1,
    });

    return response.json({ schedules });
  } catch (error) {
    return next(error);
  }
}

export async function createSchedule(request, response, next) {
  try {
    const trip = await Trip.findOne({
      _id: request.params.tripId,
      owner: request.user._id,
    });

    if (!trip) {
      return response.status(404).json({
        message: "Trip not found.",
      });
    }

    const {
      date,
      time,
      activity,
      location,
      notes,
    } = request.body;

    const schedule = await Schedule.create({
      trip: trip._id,
      owner: request.user._id,
      date,
      time,
      activity,
      location,
      notes,
    });

    await Notification.create({
      user: request.user._id,
      title: "Schedule Added",
      message: `Your activity "${activity}" has been added to your trip schedule.`,
      type: "Schedule",
      trip: trip._id,
    });

    return response.status(201).json({ schedule });
  } catch (error) {
    return next(error);
  }
}

export async function updateSchedule(request, response, next) {
  try {
    const schedule = await Schedule.findOne({
      _id: request.params.scheduleId,
      trip: request.params.tripId,
      owner: request.user._id,
    });

    if (!schedule) {
      return response.status(404).json({
        message: "Schedule item not found.",
      });
    }

    const allowedFields = [
      "date",
      "time",
      "activity",
      "location",
      "notes",
    ];

    allowedFields.forEach((field) => {
      if (request.body[field] !== undefined) {
        schedule[field] = request.body[field];
      }
    });

    await schedule.save();

    return response.json({ schedule });
  } catch (error) {
    return next(error);
  }
}

export async function deleteSchedule(request, response, next) {
  try {
    const schedule = await Schedule.findOne({
      _id: request.params.scheduleId,
      trip: request.params.tripId,
      owner: request.user._id,
    });

    if (!schedule) {
      return response.status(404).json({
        message: "Schedule item not found.",
      });
    }

    await schedule.deleteOne();

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}