import Trip from "../models/Trip.js";
import Member from "../models/Member.js";
import Notification from "../models/Notification.js";

function tripPayload(body) {
  const { title, destination, startDate, endDate, transportation, budget, members, description, status } = body;
  return Object.fromEntries(
    Object.entries({ title, destination, startDate, endDate, transportation, budget, members, description, status })
      .filter(([, value]) => value !== undefined),
  );
}

export async function listTrips(request, response, next) {
  try {
    const now = new Date();

    const pastTrips = await Trip.find({
  owner: request.user._id,
  endDate: { $lt: now },
  status: {
    $nin: ["Completed", "Cancelled"],
  },
});

for (const trip of pastTrips) {
  trip.status = "Completed";
  await trip.save();

  await Notification.create({
    user: request.user._id,
    title: "Trip Completed",
    message: `Your trip "${trip.title}" has been completed.`,
    type: "Trip",
    trip: trip._id,
  });
}

    const memberships = await Member.find({
      email: request.user.email.toLowerCase(),
      status: "Confirmed",
    }).select("trip");

    const trips = await Trip.find({
      $or: [
        { owner: request.user._id },
        { _id: { $in: memberships.map((membership) => membership.trip) } },
      ],
      status: { $nin: ["Completed", "Cancelled"] },
    }).sort({ startDate: 1 });

    return response.json({ trips });
  } catch (error) {
    return next(error);
  }
}

export async function listTripHistory(request, response, next) {
  try {
    const now = new Date();

    await Trip.updateMany(
      {
        owner: request.user._id,
        endDate: { $lt: now },
        status: {
          $nin: ["Completed", "Cancelled"],
        },
      },
      {
        $set: {
          status: "Completed",
        },
      }
    );

    const trips = await Trip.find({
      owner: request.user._id,
      status: {
        $in: ["Completed", "Cancelled"],
      },
    }).sort({ endDate: -1 });

    return response.json({ trips });
  } catch (error) {
    return next(error);
  }
}

async function generateUniqueJoinCode() {
  let joinCode;

  while (true) {
    joinCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const existingTrip = await Trip.findOne({
      joinCode,
    });

    if (!existingTrip) {
      return joinCode;
    }
  }
}

export async function createTrip(request, response, next) {
  try {
    const joinCode = await generateUniqueJoinCode();

    const trip = await Trip.create({
      owner: request.user._id,
      joinCode,
      ...tripPayload(request.body),
    });

    response.status(201).json({ trip });
  } catch (error) {
    next(error);
  }
}

async function findOwnedTrip(request, response) {
  const trip = await Trip.findOne({ _id: request.params.id, owner: request.user._id });
  if (!trip) {
    response.status(404).json({ message: "Trip not found." });
    return null;
  }
  return trip;
}

export async function getTrip(request, response, next) {
  try {
    const trip = await Trip.findById(request.params.id);

    if (!trip) {
      return response.status(404).json({
        message: "Trip not found.",
      });
    }

    // Owner can access the trip
    const isOwner =
      String(trip.owner) === String(request.user._id);

    if (isOwner) {
      return response.json({ trip });
    }

    // Confirmed members can access the trip
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

    return response.json({ trip });
  } catch (error) {
    return next(error);
  }
}

export async function updateTrip(request, response, next) {
  try {
    const trip = await findOwnedTrip(request, response);
    if (!trip) return;

    const oldStatus = trip.status;

    Object.assign(trip, tripPayload(request.body));

    await trip.save();

    // Create notification when a trip is cancelled
    if (
      oldStatus !== "Cancelled" &&
      trip.status === "Cancelled"
    ) {
      await Notification.create({
        user: request.user._id,
        title: "Trip Cancelled",
        message: `Your trip "${trip.title}" has been cancelled.`,
        type: "Trip",
        trip: trip._id,
      });
    }

    // Create notification when a trip is completed
    if (
      oldStatus !== "Completed" &&
      trip.status === "Completed"
    ) {
      await Notification.create({
        user: request.user._id,
        title: "Trip Completed",
        message: `Your trip "${trip.title}" has been completed.`,
        type: "Trip",
        trip: trip._id,
      });
    }

    return response.json({ trip });
  } catch (error) {
    return next(error);
  }
}

export async function deleteTrip(request, response, next) {
  try {
    const trip = await findOwnedTrip(request, response);
    if (!trip) return;

    await trip.deleteOne();
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}

export async function joinTrip(request, response, next) {
  try {
    const { joinCode } = request.body;

    if (!joinCode || !/^\d{6}$/.test(joinCode)) {
      return response.status(400).json({
        message: "Please enter a valid 6-digit join code.",
      });
    }

    const trip = await Trip.findOne({
      joinCode,
    });

    if (!trip) {
      return response.status(404).json({
        message: "Trip not found. Please check the join code.",
      });
    }

    if (
  trip.status === "Completed" ||
  trip.status === "Cancelled"
) {
  return response.status(400).json({
    message:
      trip.status === "Cancelled"
        ? "This trip has been cancelled."
        : "This trip has already been completed.",
  });
}
    // Check current number of members
    const memberCount = await Member.countDocuments({
      trip: trip._id,
    });

    if (memberCount >= trip.members) {
      return response.status(400).json({
        message: "This trip has reached its maximum capacity.",
      });
    }

    // Check if this user has already joined
    const existingMember = await Member.findOne({
      trip: trip._id,
      email: request.user.email.toLowerCase(),
    });

    if (existingMember) {
      return response.status(409).json({
        message: "You have already joined this trip.",
      });
    }

    // Add the logged-in user as a member
    const member = await Member.create({
      owner: trip.owner,
      trip: trip._id,
      name: request.user.name,
      email: request.user.email,
      role: "Member",
      status: "Confirmed",
    });

    await Notification.create({
      user: request.user._id,
      title: "Trip Joined",
      message: `You successfully joined "${trip.title}".`,
      type: "Trip",
      trip: trip._id,
    });

    await Notification.create({
      user: trip.owner,
      title: "New Member Joined",
      message: `${request.user.name} joined your trip "${trip.title}".`,
      type: "Member",
      trip: trip._id,
    });

    return response.status(201).json({
      message: "You have successfully joined the trip.",
      member,
      trip: {
        id: trip._id,
        title: trip.title,
        destination: trip.destination,
      },
    });
  } catch (error) {
    return next(error);
  }
}
