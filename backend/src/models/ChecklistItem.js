import mongoose from "mongoose";

const checklistItemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },

    label: {
      type: String,
      required: [true, "Checklist item is required."],
      trim: true,
      maxlength: [120, "Checklist item cannot exceed 120 characters."],
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "ChecklistItem",
  checklistItemSchema
);