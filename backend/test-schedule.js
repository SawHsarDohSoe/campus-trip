const loginResponse = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "teststudent@example.com",
    password: "123456",
  }),
});

const loginData = await loginResponse.json();

if (!loginResponse.ok) {
  console.log("Login failed:", loginData);
  process.exit(1);
}

const token = loginData.token;

console.log("Login successful.");

// Get the user's trips
const tripsResponse = await fetch("http://localhost:5000/api/trips", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const tripsData = await tripsResponse.json();

if (!tripsResponse.ok) {
  console.log("Unable to get trips:", tripsData);
  process.exit(1);
}

console.log("Trips found:", tripsData.trips.length);

if (tripsData.trips.length === 0) {
  console.log("No trips found. Create a trip first.");
  process.exit(1);
}

const trip = tripsData.trips[0];

console.log("Using trip:", trip.title);
console.log("Trip ID:", trip._id);

// Create schedule item
const scheduleResponse = await fetch(
  `http://localhost:5000/api/schedules/${trip._id}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      date: trip.startDate,
      time: "08:00",
      activity: "Leave University",
      location: "Kasem Bundit University",
      notes: "Students should arrive 15 minutes early.",
    }),
  }
);

const scheduleData = await scheduleResponse.json();

console.log("Schedule Status:", scheduleResponse.status);
console.log("Schedule Response:", scheduleData);