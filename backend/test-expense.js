const BASE_URL = process.env.BASE_URL

async function main() {
  // 1. Login
  const loginResponse = await fetch(
    `${BASE_URL}/api/auth/login`,
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
    return;
  }

  console.log("Login successful.");

  const token = loginData.token;

  // 2. Get trips
  const tripsResponse = await fetch(
    `${BASE_URL}/api/trips`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const tripsData = await tripsResponse.json();

  if (!tripsResponse.ok) {
    console.log("Unable to get trips:", tripsData);
    return;
  }

  console.log("Trips found:", tripsData.trips.length);

  if (tripsData.trips.length === 0) {
    console.log("No trips found. Create a trip first.");
    return;
  }

  const trip = tripsData.trips[0];

  console.log("Using trip:", trip.title);
  console.log("Trip ID:", trip._id);

  // 3. Create expense
  const expenseResponse = await fetch(
    `${BASE_URL}/api/expenses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tripId: trip._id,
        name: "Bus transportation",
        category: "Transportation",
        amount: 2500,
        date: new Date().toISOString(),
      }),
    }
  );

  const expenseData = await expenseResponse.json();

  console.log(
    "Create Expense Status:",
    expenseResponse.status
  );

  console.log("Create Expense Response:", expenseData);

  if (!expenseResponse.ok) {
    return;
  }

  const expenseId = expenseData.expense._id;

  // 4. Get expenses
  const listResponse = await fetch(
    `${BASE_URL}/api/expenses?tripId=${trip._id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const listData = await listResponse.json();

  console.log(
    "Get Expenses Status:",
    listResponse.status
  );

  console.log("Expenses:", listData.expenses);

  // 5. Delete expense
  const deleteResponse = await fetch(
    `${BASE_URL}/api/expenses/${expenseId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(
    "Delete Expense Status:",
    deleteResponse.status
  );

  if (deleteResponse.status === 204) {
    console.log("Expense deleted successfully.");
  } else {
    console.log(
      "Delete Response:",
      await deleteResponse.text()
    );
  }
}

main().catch((error) => {
  console.error("Test failed:", error);
});