import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
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

    name: {
      type: String,
      required: [true, "Member name is required."],
      trim: true,
      maxlength: [80, "Member name cannot exceed 80 characters."],
    },

    email: {
      type: String,
      required: [true, "Member email is required."],
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["Member", "Trip Leader"],
      default: "Member",
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);