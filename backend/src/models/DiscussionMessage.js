import mongoose from "mongoose";

const discussionMessageSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    message: {
      type: String,
      required: [true, "Message is required."],
      trim: true,
      maxlength: [
        500,
        "Message cannot exceed 500 characters.",
      ],
    },
  },
  {
    timestamps: true,
  }
);

discussionMessageSchema.index({
  trip: 1,
  createdAt: 1,
});

export default mongoose.model(
  "DiscussionMessage",
  discussionMessageSchema
);