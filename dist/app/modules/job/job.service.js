"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobServices = void 0;
const job_model_1 = require("./job.model");
// Add a new job
const addJob = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const payloadData = Object.assign(Object.assign({}, payload), { title: `Need ${payload === null || payload === void 0 ? void 0 : payload.category} for ${payload === null || payload === void 0 ? void 0 : payload.class} Student` });
    const result = yield job_model_1.Job.create(payloadData);
    return result;
});
// Get all jobs (infinite scroll)
const getAllJobs = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}, skip = 0, limit = 10) {
    const query = {};
    // Search on jobId or title
    if (filters.keyword) {
        query.$or = [
            { jobId: { $regex: filters.keyword, $options: "i" } },
            { title: { $regex: filters.keyword, $options: "i" } },
        ];
    }
    // Filters (all case-insensitive)
    if (filters.tuitionType)
        query.tuitionType = { $regex: `^${filters.tuitionType}$`, $options: "i" };
    if (filters.category)
        query.category = { $regex: `^${filters.category}$`, $options: "i" };
    if (filters.studentGender)
        query.studentGender = {
            $regex: `^${filters.studentGender}$`,
            $options: "i",
        };
    if (filters.class)
        query.class = { $regex: `^${filters.class}$`, $options: "i" };
    if (filters.city)
        query.city = { $regex: `^${filters.city}$`, $options: "i" };
    if (filters.area)
        query.area = { $regex: `^${filters.area}$`, $options: "i" };
    if (filters.tutoringDays)
        query.tutoringDays = { $regex: filters.tutoringDays, $options: "i" };
    if (filters.preferredTutorGender)
        query.preferredTutorGender = {
            $regex: `^${filters.preferredTutorGender}$`,
            $options: "i",
        };
    const [data, total] = yield Promise.all([
        job_model_1.Job.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        job_model_1.Job.countDocuments(query),
    ]);
    return {
        data,
        meta: {
            total,
            skip,
            limit,
            hasMore: skip + data.length < total, // useful for infinite scroll
        },
    };
});
// Get single job by ID
const getSingleJobById = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield job_model_1.Job.findOne({ jobId });
    return job;
});
// Update job by ID
const updateJob = (jobId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedJob = yield job_model_1.Job.findByIdAndUpdate(jobId, payload, { new: true });
    return updatedJob;
});
// Delete job by ID
const deleteJob = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedJob = yield job_model_1.Job.findByIdAndDelete(jobId);
    return deletedJob;
});
exports.JobServices = {
    addJob,
    getAllJobs,
    getSingleJobById,
    updateJob,
    deleteJob,
};
