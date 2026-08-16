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

const tripResponse = await fetch("http://localhost:5000/api/trips", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "Bangkok University Tour",
    destination: "Bangkok",
    startDate: "2026-09-15",
    endDate: "2026-09-17",
    transportation: "Bus",
    budget: 10000,
    members: 20,
    description: "A campus trip to Bangkok for students.",
    status: "Planning",
  }),
});

const tripData = await tripResponse.json();

console.log("Trip Status:", tripResponse.status);
console.log("Trip Response:", tripData);