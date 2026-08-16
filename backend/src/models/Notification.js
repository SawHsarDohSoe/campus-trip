import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Notification title is required."],
      trim: true,
      maxlength: [120, "Notification title cannot exceed 120 characters."],
    },

    message: {
      type: String,
      required: [true, "Notification message is required."],
      trim: true,
      maxlength: [500, "Notification message cannot exceed 500 characters."],
    },

    type: {
  type: String,
  enum: [
    "Trip",
    "Schedule",
    "Checklist",
    "Budget",
    "Member",
    "Poll",
    "Discussion",
    "System",
  ],
  default: "System",
},

    read: {
      type: Boolean,
      default: false,
    },

    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);