const loginResponse = await fetch(
  "http://localhost:5000/api/auth/login",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "teststudent@example.com",
      password: "123456",
    }),
  }
);

const loginData = await loginResponse.json();

if (!loginResponse.ok) {
  console.log("Login failed:", loginData);
  process.exit(1);
}

console.log("Login successful.");

const weatherResponse = await fetch(
  "http://localhost:5000/api/weather?city=Bangkok",
  {
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  }
);

const weatherData = await weatherResponse.json();

console.log("Weather Status:", weatherResponse.status);
console.log("Weather Response:", weatherData);