export function getWeatherLocation(trip) {
  if (!trip) return "";

  const destinationParts = (trip.destination || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const destinationCity = destinationParts[0] || "";
  const destinationCountry = destinationParts.at(-1) || "";
  const locality = trip.tambon?.trim() || trip.district?.trim() || destinationCity;
  const district = trip.district?.trim() || "";

  return [locality, district, destinationCountry]
    .filter((part, index, parts) =>
      part && parts.findIndex((candidate) => candidate.toLowerCase() === part.toLowerCase()) === index
    )
    .join(", ");
}
