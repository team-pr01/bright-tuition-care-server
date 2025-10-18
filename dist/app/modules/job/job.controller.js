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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const job_service_1 = require("./job.service");
// Add Job
const addJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_service_1.JobServices.addJob(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Job added successfully",
        data: result,
    });
}));
// Get All Jobs (Infinite Scroll)
const getAllJobs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, tuitionType, category, studentGender, class: jobClass, city, area, tutoringDays, preferredTutorGender, skip = "0", limit = "10", } = req.query;
    const filters = {
        keyword: keyword,
        tuitionType: tuitionType,
        category: category,
        studentGender: studentGender,
        class: jobClass,
        city: city,
        area: area,
        tutoringDays: tutoringDays,
        preferredTutorGender: preferredTutorGender,
    };
    const result = yield job_service_1.JobServices.getAllJobs(filters, Number(skip), Number(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Jobs retrieved successfully",
        data: {
            jobs: result.data,
            meta: result.meta,
        },
    });
}));
// Get Single Job by ID
const getSingleJobById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield job_service_1.JobServices.getSingleJobById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job retrieved successfully",
        data: result,
    });
}));
// Update Job
const updateJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield job_service_1.JobServices.updateJob(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job updated successfully",
        data: result,
    });
}));
// Delete Job
const deleteJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield job_service_1.JobServices.deleteJob(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job deleted successfully",
        data: result,
    });
}));
exports.JobControllers = {
    addJob,
    getAllJobs,
    getSingleJobById,
    updateJob,
    deleteJob,
};
