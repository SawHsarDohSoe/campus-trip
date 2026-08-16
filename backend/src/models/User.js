import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must be at least 6 characters."],
      select: false,
    },
    university: {
  type: String,
  trim: true,
  maxlength: [150, "University name cannot exceed 150 characters."],
  default: "",
},

notifications: {
  tripUpdates: {
    type: Boolean,
    default: true,
  },

  budgetAlerts: {
    type: Boolean,
    default: true,
  },

  memberInvitations: {
    type: Boolean,
    default: true,
  },
},
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.isPasswordCorrect = function isPasswordCorrect(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
