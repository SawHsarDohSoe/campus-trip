import Notification from "../models/Notification.js";

export async function listNotifications(request, response, next) {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // The TTL index performs the background cleanup. This makes expiry
    // immediate when a user opens notifications, including on older indexes.
    await Notification.deleteMany({
      user: request.user._id,
      createdAt: { $lt: oneMonthAgo },
    });

    const notifications = await Notification.find({
      user: request.user._id,
    }).sort({
      createdAt: -1,
    });

    return response.json({ notifications });
  } catch (error) {
    return next(error);
  }
}

export async function markNotificationRead(request, response, next) {
  try {
    const notification = await Notification.findOne({
      _id: request.params.id,
      user: request.user._id,
    });

    if (!notification) {
      return response.status(404).json({
        message: "Notification not found.",
      });
    }

    notification.read = true;

    await notification.save();

    return response.json({ notification });
  } catch (error) {
    return next(error);
  }
}

export async function markAllNotificationsRead(
  request,
  response,
  next
) {
  try {
    await Notification.updateMany(
      {
        user: request.user._id,
        read: false,
      },
      {
        $set: {
          read: true,
        },
      }
    );

    return response.json({
      message: "All notifications marked as read.",
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteNotification(
  request,
  response,
  next
) {
  try {
    const notification = await Notification.findOne({
      _id: request.params.id,
      user: request.user._id,
    });

    if (!notification) {
      return response.status(404).json({
        message: "Notification not found.",
      });
    }

    await notification.deleteOne();

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}
