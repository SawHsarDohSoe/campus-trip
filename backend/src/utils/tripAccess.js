import Member from "../models/Member.js";
import Trip from "../models/Trip.js";

export async function getTripAccess(user, tripId) {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    return { trip: null, isOwner: false, isMember: false };
  }

  const isOwner = String(trip.owner) === String(user._id);
  if (isOwner) {
    return { trip, isOwner: true, isMember: true };
  }

  const membership = await Member.findOne({
    trip: trip._id,
    email: user.email.toLowerCase(),
    status: "Confirmed",
  });

  return { trip, isOwner: false, isMember: Boolean(membership) };
}
