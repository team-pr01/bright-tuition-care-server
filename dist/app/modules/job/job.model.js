"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
// Generate unique Job ID
function generateJobId() {
    const prefix = "job";
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const random = crypto_1.default.randomBytes(3).toString("hex").toUpperCase(); // 6-char random
    return `${prefix}-${date}-${random}`;
}
// Job Schema
const jobSchema = new mongoose_1.Schema({
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
    locationDirection: { type: String, required: true }, // Google Maps link
    status: {
        type: String,
        enum: ["pending", "live", "closed", "cancelled"],
        default: "pending",
    },
    applications: [
        {
            tutor: { type: mongoose_1.Types.ObjectId, ref: "Tutor", required: true },
            appliedOn: { type: Date, default: Date.now },
            status: {
                type: String,
                enum: [
                    "pending",
                    "shortlisted",
                    "appointed",
                    "confirmed",
                    "rejected",
                ],
                default: "pending",
            },
            selectedTutor: { type: mongoose_1.Types.ObjectId, ref: "Tutor" },
            rating: { type: Number, min: 0, max: 5 },
        },
    ],
}, { timestamps: true });
// pre-save middleware to auto-update other applicants when selectedTutor is set
jobSchema.pre("save", function (next) {
    const job = this;
    const selected = job.applications.find((app) => app.selectedTutor);
    if (selected) {
        job.applications = job.applications.map((app) => {
            if (app.tutor.toString() === selected.tutor.toString()) {
                app.status = "appointed";
            }
            else {
                app.status = "rejected";
            }
            return app;
        });
    }
    next();
});
exports.Job = (0, mongoose_1.model)("Job", jobSchema);
