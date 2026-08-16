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

  // 3. Create member
  const createResponse = await fetch(
    `${BASE_URL}/api/members`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tripId: trip._id,
        name: "Test Member",
        email: "member@example.com",
        role: "Member",
      }),
    }
  );

  const createData = await createResponse.json();

  console.log(
    "Create Member Status:",
    createResponse.status
  );

  console.log(
    "Create Member Response:",
    createData
  );

  if (!createResponse.ok) {
    return;
  }

  const memberId = createData.member._id;

  // 4. Get members
  const listResponse = await fetch(
    `${BASE_URL}/api/members?tripId=${trip._id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const listData = await listResponse.json();

  console.log(
    "Get Members Status:",
    listResponse.status
  );

  console.log("Members:", listData.members);

  // 5. Update member
  const updateResponse = await fetch(
    `${BASE_URL}/api/members/${memberId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: "Confirmed",
      }),
    }
  );

  const updateData = await updateResponse.json();

  console.log(
    "Update Member Status:",
    updateResponse.status
  );

  console.log(
    "Updated Member:",
    updateData
  );

  // 6. Delete member
  const deleteResponse = await fetch(
    `${BASE_URL}/api/members/${memberId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(
    "Delete Member Status:",
    deleteResponse.status
  );

  if (deleteResponse.status === 204) {
    console.log(
      "Member deleted successfully."
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