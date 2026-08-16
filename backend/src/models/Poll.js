import mongoose from "mongoose";

const pollOptionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Poll option is required."],
      trim: true,
      maxlength: [120, "Poll option cannot exceed 120 characters."],
    },

    votes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: true }
);

const pollSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    question: {
      type: String,
      required: [true, "Poll question is required."],
      trim: true,
      maxlength: [200, "Poll question cannot exceed 200 characters."],
    },

    options: {
      type: [pollOptionSchema],
      validate: {
        validator: (options) =>
          options.length >= 2 && options.length <= 6,
        message: "A poll must have between 2 and 6 options.",
      },
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

pollSchema.index({ trip: 1, createdAt: -1 });

export default mongoose.model("Poll", pollSchema);