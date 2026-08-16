import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
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
      required: [true, "Expense name is required."],
      trim: true,
      maxlength: [120, "Expense name cannot exceed 120 characters."],
    },

    category: {
      type: String,
      enum: [
        "Transportation",
        "Accommodation",
        "Food",
        "Activities",
        "Other",
      ],
      default: "Other",
    },

    amount: {
      type: Number,
      required: [true, "Expense amount is required."],
      min: [0, "Expense amount cannot be negative."],
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);