const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(url, options = {}) {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong."
    );
  }

  return data;
}

// Get all polls for a trip
export async function getPolls(token, tripId) {
  return request(`/polls/${tripId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Create a new poll
export async function createPoll(token, tripId, pollData) {
  return request(`/polls/${tripId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(pollData),
  });
}

// Vote on a poll
export async function votePoll(
  token,
  tripId,
  pollId,
  optionId
) {
  return request(
    `/polls/${tripId}/${pollId}/vote`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        optionId,
      }),
    }
  );
}

// Close a poll
export async function closePoll(
  token,
  tripId,
  pollId
) {
  return request(
    `/polls/${tripId}/${pollId}/close`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}