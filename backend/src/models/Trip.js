import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Trip name is required."],
      trim: true,
      maxlength: [120, "Trip name cannot exceed 120 characters."],
    },
    destination: {
      type: String,
      required: [true, "Destination is required."],
      trim: true,
    },
    startDate: { type: Date, required: [true, "Start date is required."] },
    endDate: { type: Date, required: [true, "End date is required."] },
    transportation: {
      type: String,
      enum: ["Bus", "Van", "Train", "Airplane"],
      default: "Bus",
    },
    budget: { type: Number, required: [true, "Budget is required."], min: 0 },
    members: { type: Number, required: [true, "Member capacity is required."], min: 1 },
    description: { type: String, required: [true, "Description is required."], trim: true },
    status: {
      type: String,
      enum: ["Planning", "Upcoming", "Completed", "Cancelled"],
      default: "Planning",
    },
    joinCode: {
  type: String,
  unique: true,
  index: true,
  match: [/^\d{6}$/, "Join code must be exactly 6 digits."],
},
  },
  { timestamps: true },
);

tripSchema.pre("validate", function validateDates(next) {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    this.invalidate("endDate", "End date must be on or after the start date.");
  }
  next();
});

export default mongoose.model("Trip", tripSchema);
