import DiscussionMessage from "../models/DiscussionMessage.js";
import Trip from "../models/Trip.js";
import Member from "../models/Member.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

async function findTripForMember(request, tripId) {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    return null;
  }

  const isOwner =
    String(trip.owner) === String(request.user._id);

  if (isOwner) {
    return trip;
  }

  const member = await Member.findOne({
    trip: trip._id,
    email: request.user.email.toLowerCase(),
    status: "Confirmed",
  });

  if (!member) {
    return null;
  }

  return trip;
}

export async function listMessages(request, response, next) {
  try {
    const trip = await findTripForMember(
      request,
      request.params.tripId
    );

    if (!trip) {
      return response.status(404).json({
        message:
          "Trip not found or you are not a member.",
      });
    }

    const messages = await DiscussionMessage.find({
      trip: trip._id,
    })
      .populate("user", "name email")
      .sort({ createdAt: 1 });

    return response.json({ messages });
  } catch (error) {
    return next(error);
  }
}

export async function createMessage(request, response, next) {
  try {
    const trip = await findTripForMember(
      request,
      request.params.tripId
    );

    if (!trip) {
      return response.status(404).json({
        message:
          "Trip not found or you are not a member.",
      });
    }

    if (
      trip.status === "Completed" ||
      trip.status === "Cancelled"
    ) {
      return response.status(400).json({
        message:
          "You cannot send messages on a completed or cancelled trip.",
      });
    }

    const { message } = request.body;

    if (!message || !message.trim()) {
      return response.status(400).json({
        message: "Message cannot be empty.",
      });
    }

    const newMessage = await DiscussionMessage.create({
      trip: trip._id,
      user: request.user._id,
      message: message.trim(),
    });

    await newMessage.populate("user", "name email");

    // Find confirmed members
    const members = await Member.find({
      trip: trip._id,
      status: "Confirmed",
    });

    // Get their User accounts using email
    const memberEmails = members
      .map((member) => member.email.toLowerCase())
      .filter(
        (email) =>
          email !== request.user.email.toLowerCase()
      );

    const users = await User.find({
      email: {
        $in: memberEmails,
      },
    }).select("_id email");

    // Send notification to other members
    if (users.length > 0) {
      await Notification.insertMany(
        users.map((user) => ({
          user: user._id,
          title: "New Discussion Message",
          message: `${request.user.name} sent a message in "${trip.title}".`,
          type: "Discussion",
          trip: trip._id,
        }))
      );
    }

    return response.status(201).json({
      message: newMessage,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteMessage(request, response, next) {
  try {
    const message = await DiscussionMessage.findOne({
      _id: request.params.messageId,
      trip: request.params.tripId,
      user: request.user._id,
    });

    if (!message) {
      return response.status(404).json({
        message: "Message not found.",
      });
    }

    await message.deleteOne();

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}