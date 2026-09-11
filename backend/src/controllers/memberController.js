import Member from "../models/Member.js";
import { getTripAccess } from "../utils/tripAccess.js";

export async function listMembers(request, response, next) {
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

    const members = await Member.find(filter)
      .sort({ createdAt: 1 });

    response.json({ members });
  } catch (error) {
    next(error);
  }
}

export async function createMember(request, response, next) {
  try {
    const {
      tripId,
      name,
      email,
      role,
    } = request.body;

    const { trip, isMember } = await getTripAccess(request.user, tripId);

    if (!trip) {
      return response.status(404).json({
        message: "Trip not found.",
      });
    }
    if (!isMember) return response.status(403).json({ message: "You are not a member of this trip." });

    const existingMember = await Member.findOne({
      trip: trip._id,
      email: email?.toLowerCase(),
    });

    if (existingMember) {
      return response.status(409).json({
        message: "This student is already a member of this trip.",
      });
    }

    const member = await Member.create({
      owner: request.user._id,
      trip: trip._id,
      name,
      email,
      role,
      status: "Pending",
    });

    return response.status(201).json({ member });
  } catch (error) {
    next(error);
  }
}

export async function updateMember(request, response, next) {
  try {
    const member = await Member.findOne({
      _id: request.params.id,
      owner: request.user._id,
    });

    if (!member) {
      return response.status(404).json({
        message: "Member not found.",
      });
    }

    if (request.body.name !== undefined) {
      member.name = request.body.name;
    }

    if (request.body.email !== undefined) {
      member.email = request.body.email;
    }

    if (request.body.role !== undefined) {
      member.role = request.body.role;
    }

    if (request.body.status !== undefined) {
      member.status = request.body.status;
    }

    await member.save();

    return response.json({ member });
  } catch (error) {
    next(error);
  }
}

export async function deleteMember(request, response, next) {
  try {
    const member = await Member.findOne({
      _id: request.params.id,
      owner: request.user._id,
    });

    if (!member) {
      return response.status(404).json({
        message: "Member not found.",
      });
    }

    await member.deleteOne();

    return response.status(204).send();
  } catch (error) {
    next(error);
  }
}
