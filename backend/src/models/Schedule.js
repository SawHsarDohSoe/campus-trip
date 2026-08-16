import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
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

    date: {
      type: Date,
      required: [true, "Schedule date is required."],
    },

    time: {
      type: String,
      required: [true, "Schedule time is required."],
    },

    activity: {
      type: String,
      required: [true, "Activity name is required."],
      trim: true,
      maxlength: [150, "Activity name cannot exceed 150 characters."],
    },

    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters."],
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters."],
    },
  },
  { timestamps: true },
);

scheduleSchema.index({ trip: 1, date: 1, time: 1 });

export default mongoose.model("Schedule", scheduleSchema);