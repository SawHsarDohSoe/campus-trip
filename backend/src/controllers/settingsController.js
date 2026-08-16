export async function getSettings(request, response) {
  const user = request.user;

  response.json({
    profile: {
      name: user.name,
      email: user.email,
      university: user.university ?? "",
    },

    notifications: {
      tripUpdates: user.notifications?.tripUpdates ?? true,
      budgetAlerts: user.notifications?.budgetAlerts ?? true,
      memberInvitations:
        user.notifications?.memberInvitations ?? true,
    },
  });
}

export async function updateSettings(
  request,
  response,
  next
) {
  try {
    const { profile, notifications } = request.body;

    if (profile) {
      if (profile.name !== undefined) {
        request.user.name = profile.name;
      }

      if (profile.email !== undefined) {
        request.user.email = profile.email;
      }

      if (profile.university !== undefined) {
        request.user.university = profile.university;
      }
    }

    if (notifications) {
      if (notifications.tripUpdates !== undefined) {
        request.user.notifications.tripUpdates =
          notifications.tripUpdates;
      }

      if (notifications.budgetAlerts !== undefined) {
        request.user.notifications.budgetAlerts =
          notifications.budgetAlerts;
      }

      if (
        notifications.memberInvitations !== undefined
      ) {
        request.user.notifications.memberInvitations =
          notifications.memberInvitations;
      }
    }

    await request.user.save();

    response.json({
      message: "Settings updated successfully.",

      profile: {
        name: request.user.name,
        email: request.user.email,
        university: request.user.university ?? "",
      },

      notifications: {
        tripUpdates:
          request.user.notifications?.tripUpdates ?? true,

        budgetAlerts:
          request.user.notifications?.budgetAlerts ?? true,

        memberInvitations:
          request.user.notifications?.memberInvitations ?? true,
      },
    });
  } catch (error) {
    next(error);
  }
}