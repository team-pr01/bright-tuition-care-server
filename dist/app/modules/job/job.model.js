"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const mongoose_1 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
function generateJobId() {
    const prefix = "job";
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const random = crypto_1.default.randomBytes(3).toString("hex").toUpperCase(); // 6-char random
    return `${prefix}-${date}-${random}`;
}
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
    locationDirection: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "live", "closed", "cancelled"],
        default: "pending",
    },
    applications: [{ type: mongoose_1.Types.ObjectId, ref: "User", required: false, default: [] }],
}, { timestamps: true });
exports.Job = (0, mongoose_1.model)("Job", jobSchema);
