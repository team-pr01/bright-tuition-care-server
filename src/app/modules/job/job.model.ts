import { Schema, model, Types } from "mongoose";
import crypto from "crypto";
import { TJobs } from "./job.interface";

function generateJobId() {
  const prefix = "job";
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const random = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6-char random
  return `${prefix}-${date}-${random}`;
}

const jobSchema = new Schema<TJobs>(
  {
    jobId: {
      type: String,
      unique: true,
      default: generateJobId,
    },
    title: { type: String, required: true },
    salary: { type: Number, required: true },
    tuitionType: { type: String, required: true },
    category: { type: String, required: true },
    tutoringTime: { type: String, required: true },
    tutoringDays: { type: String, required: true },
    subjects: { type: String, required: true },
    otherRequirements: { type: String },
    preferredTutorGender: {
      type: String,
      enum: ["male", "female", "any"],
      required: true,
    },
    numberOfStudents: { type: Number, required: true },
    studentGender: {
      type: String,
      enum: ["male", "female", "any"],
      required: true,
    },
    class: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    address: { type: String, required: true },
    locationDirection: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "live", "closed", "cancelled"],
      default: "pending",
    },
    applications: [{ type: Types.ObjectId, ref: "User", required: false, default: [] }],
  },
  { timestamps: true }
);

export const Job = model<TJobs>("Job", jobSchema);
