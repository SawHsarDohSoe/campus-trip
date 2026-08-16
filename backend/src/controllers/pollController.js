import Poll from "../models/Poll.js";
import PollVote from "../models/PollVote.js";
import Trip from "../models/Trip.js";
import Member from "../models/Member.js";
import Notification from "../models/Notification.js";

async function findTripForMember(request, tripId) {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    return null;
  }

  const isOwner =
    trip.owner.toString() === request.user._id.toString();

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

export async function listPolls(request, response, next) {
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

    const polls = await Poll.find({
      trip: trip._id,
    }).sort({
      createdAt: -1,
    });

    return response.json({ polls });
  } catch (error) {
    return next(error);
  }
}

export async function createPoll(request, response, next) {
  try {
    const trip = await Trip.findOne({
      _id: request.params.tripId,
      owner: request.user._id,
    });

    if (!trip) {
      return response.status(404).json({
        message:
          "Only the trip owner can create a poll.",
      });
    }

    if (
      trip.status === "Completed" ||
      trip.status === "Cancelled"
    ) {
      return response.status(400).json({
        message:
          "You cannot create a poll for a completed or cancelled trip.",
      });
    }

    const {
      question,
      options,
      expiresAt,
    } = request.body;

    if (!question || !question.trim()) {
      return response.status(400).json({
        message: "Poll question is required.",
      });
    }

    if (
      !Array.isArray(options) ||
      options.length < 2 ||
      options.length > 6
    ) {
      return response.status(400).json({
        message:
          "A poll must have between 2 and 6 options.",
      });
    }

    const cleanedOptions = options
      .map((option) => String(option).trim())
      .filter(Boolean);

    if (cleanedOptions.length < 2) {
      return response.status(400).json({
        message:
          "Please provide at least 2 valid options.",
      });
    }

    const poll = await Poll.create({
      trip: trip._id,
      owner: request.user._id,
      question: question.trim(),
      options: cleanedOptions.map((text) => ({
        text,
        votes: 0,
      })),
      expiresAt: expiresAt || null,
    });

    // Notify confirmed members about the new poll
    const members = await Member.find({
      trip: trip._id,
      status: "Confirmed",
    });

    const memberNotifications = members
      .filter(
        (member) =>
          member.email.toLowerCase() !==
          request.user.email.toLowerCase()
      )
      .map(async (member) => {
        // Find the user's ID through the member email
        return member;
      });

    const confirmedMembers =
      await Promise.all(memberNotifications);

    // Create notifications for users who are members
    // and have matching User accounts
    const User = (await import("../models/User.js")).default;

    const users = await User.find({
      email: {
        $in: confirmedMembers.map((member) =>
          member.email.toLowerCase()
        ),
      },
    }).select("_id email");

    if (users.length > 0) {
      await Notification.insertMany(
        users.map((user) => ({
          user: user._id,
          title: "New Poll",
          message: `A new poll was created for "${trip.title}".`,
          type: "Poll",
          trip: trip._id,
        }))
      );
    }

    return response.status(201).json({ poll });
  } catch (error) {
    return next(error);
  }
}

export async function votePoll(request, response, next) {
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
          "You cannot vote on a completed or cancelled trip.",
      });
    }

    const poll = await Poll.findOne({
      _id: request.params.pollId,
      trip: trip._id,
    });

    if (!poll) {
      return response.status(404).json({
        message: "Poll not found.",
      });
    }

    if (poll.status === "Closed") {
      return response.status(400).json({
        message: "This poll is closed.",
      });
    }

    if (
      poll.expiresAt &&
      new Date(poll.expiresAt) <= new Date()
    ) {
      poll.status = "Closed";

      await poll.save();

      return response.status(400).json({
        message: "This poll has expired.",
      });
    }

    const { optionId } = request.body;

    const option = poll.options.id(optionId);

    if (!option) {
      return response.status(400).json({
        message: "Invalid poll option.",
      });
    }

    const existingVote = await PollVote.findOne({
      poll: poll._id,
      user: request.user._id,
    });

    if (existingVote) {
      return response.status(409).json({
        message:
          "You have already voted on this poll.",
      });
    }

    await PollVote.create({
      poll: poll._id,
      user: request.user._id,
      option: option._id,
    });

    option.votes += 1;

    await poll.save();

    return response.status(201).json({
      message: "Your vote has been recorded.",
      poll,
    });
  } catch (error) {
    if (error.code === 11000) {
      return response.status(409).json({
        message:
          "You have already voted on this poll.",
      });
    }

    return next(error);
  }
}

export async function closePoll(request, response, next) {
  try {
    const poll = await Poll.findOne({
      _id: request.params.pollId,
      trip: request.params.tripId,
      owner: request.user._id,
    });

    if (!poll) {
      return response.status(404).json({
        message: "Poll not found.",
      });
    }

    poll.status = "Closed";

    await poll.save();

    return response.json({
      message: "Poll closed successfully.",
      poll,
    });
  } catch (error) {
    return next(error);
  }
}