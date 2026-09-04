const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function registerUser({ name, email, password }) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed.");
  }

  return data;
}

export async function loginUser({ email, password }) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed.");
  }

  return data;
}

export async function getCurrentUser(token) {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to get current user.");
  }

  return data;
}

export async function createTrip(tripData, token) {
  const response = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tripData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to create trip.");
  }

  return data;
}

export async function getTrips(token) {
  const response = await fetch(`${API_URL}/trips`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load trips.");
  }

  return data;
}

export async function deleteTrip(tripId, token) {
  const response = await fetch(`${API_URL}/trips/${tripId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Unable to delete trip.");
  }

  return true;
}

export async function getTrip(tripId, token) {
  const response = await fetch(`${API_URL}/trips/${tripId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load trip.");
  }

  return data;
}

export async function updateTrip(tripId, tripData, token) {
  const response = await fetch(`${API_URL}/trips/${tripId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tripData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to update trip.");
  }

  return data;
}

export async function getTripHistory(token) {
  const response = await fetch(`${API_URL}/trips/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load trip history."
    );
  }

  return data;
}

export async function getSchedules(tripId, token) {
  const response = await fetch(`${API_URL}/schedules/${tripId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load schedule.");
  }

  return data;
}

export async function createSchedule(tripId, scheduleData, token) {
  const response = await fetch(`${API_URL}/schedules/${tripId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(scheduleData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to create schedule.");
  }

  return data;
}

export async function deleteSchedule(tripId, scheduleId, token) {
  const response = await fetch(
    `${API_URL}/schedules/${tripId}/${scheduleId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Unable to delete schedule.");
  }

  return true;
}

export async function updateSchedule(
  tripId,
  scheduleId,
  data,
  token
) {
  const response = await fetch(
    `${API_URL}/schedules/${tripId}/${scheduleId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update schedule."
    );
  }

  return result;
}

export async function getWeather(city, token) {
  const response = await fetch(
    `${API_URL}/weather?city=${encodeURIComponent(city)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load weather.");
  }

  return data;
}

export async function getExpenses(token, tripId) {
  const url = tripId
    ? `${API_URL}/expenses?tripId=${encodeURIComponent(tripId)}`
    : `${API_URL}/expenses`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load expenses.");
  }

  return data;
}

export async function createExpense(expenseData, token) {
  const response = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(expenseData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to create expense.");
  }

  return data;
}

export async function updateExpense(
  expenseId,
  expenseData,
  token
) {
  const response = await fetch(
    `${API_URL}/expenses/${expenseId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(expenseData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update expense."
    );
  }

  return data;
}

export async function deleteExpense(expenseId, token) {
  const response = await fetch(
    `${API_URL}/expenses/${expenseId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok && response.status !== 204) {
    const data = await response.json();
    throw new Error(
      data.message || "Unable to delete expense."
    );
  }
}

export async function getChecklistItems(token, tripId) {
  const response = await fetch(
    `${API_URL}/checklist?tripId=${encodeURIComponent(tripId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load checklist."
    );
  }

  return data;
}

export async function createChecklistItem(
  itemData,
  token
) {
  const response = await fetch(`${API_URL}/checklist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to create checklist item."
    );
  }

  return data;
}

export async function updateChecklistItem(
  itemId,
  itemData,
  token
) {
  const response = await fetch(
    `${API_URL}/checklist/${itemId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update checklist item."
    );
  }

  return data;
}

export async function deleteChecklistItem(
  itemId,
  token
) {
  const response = await fetch(
    `${API_URL}/checklist/${itemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok && response.status !== 204) {
    const data = await response.json();

    throw new Error(
      data.message || "Unable to delete checklist item."
    );
  }
}

export async function getMembers(token, tripId) {
  const response = await fetch(
    `${API_URL}/members?tripId=${encodeURIComponent(tripId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load members."
    );
  }

  return data;
}

export async function createMember(memberData, token) {
  const response = await fetch(`${API_URL}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(memberData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to invite member."
    );
  }

  return data;
}

export async function updateMember(memberId, memberData, token) {
  const response = await fetch(
    `${API_URL}/members/${memberId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(memberData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update member."
    );
  }

  return data;
}

export async function deleteMember(memberId, token) {
  const response = await fetch(
    `${API_URL}/members/${memberId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok && response.status !== 204) {
    const data = await response.json();

    throw new Error(
      data.message || "Unable to delete member."
    );
  }
}

export async function getSettings(token) {
  const response = await fetch(`${API_URL}/settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load settings."
    );
  }

  return data;
}

export async function updateSettings(settingsData, token) {
  const response = await fetch(`${API_URL}/settings`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settingsData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update settings."
    );
  }

  return data;
}

export async function joinTrip(joinCode, token) {
  const response = await fetch(`${API_URL}/trips/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      joinCode,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to join trip."
    );
  }

  return data;
}

export async function getNotifications(token) {
  const response = await fetch(`${API_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load notifications."
    );
  }

  return data;
}

export async function markNotificationRead(
  notificationId,
  token
) {
  const response = await fetch(
    `${API_URL}/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to mark notification as read."
    );
  }

  return data;
}

export async function markAllNotificationsRead(token) {
  const response = await fetch(
    `${API_URL}/notifications/read-all`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to mark notifications as read."
    );
  }

  return data;
}

export async function deleteNotification(notificationId, token) {
  const response = await fetch(
    `${API_URL}/notifications/${notificationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      data.message || "Unable to delete notification."
    );
  }
}

export async function getPolls(tripId, token) {
  const response = await fetch(
    `${API_URL}/polls/${tripId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load polls."
    );
  }

  return data;
}

export async function createPoll(
  tripId,
  pollData,
  token
) {
  const response = await fetch(
    `${API_URL}/polls/${tripId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pollData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to create poll."
    );
  }

  return data;
}

export async function votePoll(
  tripId,
  pollId,
  optionId,
  token
) {
  const response = await fetch(
    `${API_URL}/polls/${tripId}/${pollId}/vote`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        optionId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to submit vote."
    );
  }

  return data;
}

export async function closePoll(
  tripId,
  pollId,
  token
) {
  const response = await fetch(
    `${API_URL}/polls/${tripId}/${pollId}/close`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to close poll."
    );
  }

  return data;
}

export async function getDiscussionMessages(
  tripId,
  token
) {
  const response = await fetch(
    `${API_URL}/discussions/${tripId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load discussion."
    );
  }

  return data;
}

export async function createDiscussionMessage(
  tripId,
  message,
  token
) {
  const response = await fetch(
    `${API_URL}/discussions/${tripId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to send message."
    );
  }

  return data;
}

export async function deleteDiscussionMessage(
  tripId,
  messageId,
  token
) {
  const response = await fetch(
    `${API_URL}/discussions/${tripId}/${messageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok && response.status !== 204) {
    const data = await response.json();

    throw new Error(
      data.message || "Unable to delete message."
    );
  }
}

