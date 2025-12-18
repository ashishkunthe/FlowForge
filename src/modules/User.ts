import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  notification: {
    emailEnabled: { type: Boolean, default: true },
    smsEnabled: { type: Boolean, default: false },
    reminderTime: { type: String, default: "09:00" },
    phone: { type: String, default: "" },
  },
});

export const User = mongoose.model("User", userSchema);
