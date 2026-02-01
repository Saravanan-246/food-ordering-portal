import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpiry: { type: Date },
});

export default mongoose.model("Student", studentSchema);
