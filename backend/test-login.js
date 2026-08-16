const response = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "teststudent@example.com",
    password: "123456",
  }),
});

const data = await response.json();

console.log("Status:", response.status);
console.log("Response:", data);