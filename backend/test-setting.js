const BASE_URL = "http://localhost:5000";

async function main() {
  // Login
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

  // Get settings
  const getResponse = await fetch(
    `${BASE_URL}/api/settings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const settingsData = await getResponse.json();

  console.log(
    "Get Settings Status:",
    getResponse.status
  );

  console.log(
    "Settings:",
    settingsData
  );

  // Update settings
  const updateResponse = await fetch(
    `${BASE_URL}/api/settings`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        profile: {
          name: "Test Student Updated",
          email: "teststudent@example.com",
          university: "Kasem Bundit University",
        },

        notifications: {
          tripUpdates: true,
          budgetAlerts: false,
          memberInvitations: true,
        },
      }),
    }
  );

  const updateData = await updateResponse.json();

  console.log(
    "Update Settings Status:",
    updateResponse.status
  );

  console.log(
    "Updated Settings:",
    updateData
  );

  // Get again to verify persistence
  const verifyResponse = await fetch(
    `${BASE_URL}/api/settings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const verifyData = await verifyResponse.json();

  console.log(
    "Verify Settings Status:",
    verifyResponse.status
  );

  console.log(
    "Verified Settings:",
    verifyData
  );
}

main().catch((error) => {
  console.error("Test failed:", error);
});