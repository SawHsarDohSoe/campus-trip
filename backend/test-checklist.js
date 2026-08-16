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

  if (tripsData.trips.length === 0) {
    console.log("No trips found. Create a trip first.");
    return;
  }

  const trip = tripsData.trips[0];

  console.log("Using trip:", trip.title);
  console.log("Trip ID:", trip._id);

  // 3. Create checklist item
  const createResponse = await fetch(
    `${BASE_URL}/api/checklist`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tripId: trip._id,
        label: "Bring student ID",
      }),
    }
  );

  const createData = await createResponse.json();

  console.log(
    "Create Checklist Status:",
    createResponse.status
  );

  console.log(
    "Create Checklist Response:",
    createData
  );

  if (!createResponse.ok) {
    return;
  }

  const itemId = createData.item._id;

  // 4. Get checklist items
  const listResponse = await fetch(
    `${BASE_URL}/api/checklist?tripId=${trip._id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const listData = await listResponse.json();

  console.log(
    "Get Checklist Status:",
    listResponse.status
  );

  console.log("Checklist Items:", listData.items);

  // 5. Mark item as completed
  const updateResponse = await fetch(
    `${BASE_URL}/api/checklist/${itemId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        completed: true,
      }),
    }
  );

  const updateData = await updateResponse.json();

  console.log(
    "Update Checklist Status:",
    updateResponse.status
  );

  console.log(
    "Updated Checklist Item:",
    updateData
  );

  // 6. Delete checklist item
  const deleteResponse = await fetch(
    `${BASE_URL}/api/checklist/${itemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(
    "Delete Checklist Status:",
    deleteResponse.status
  );

  if (deleteResponse.status === 204) {
    console.log(
      "Checklist item deleted successfully."
    );
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