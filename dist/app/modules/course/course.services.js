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
exports.CourseServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const course_model_1 = __importDefault(require("./course.model"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const sendImageToCloudinary_1 = require("../../../utils/sendImageToCloudinary");
const cloudinary_1 = require("cloudinary");
const auth_model_1 = require("../../auth/auth.model");
const courseLecture_model_1 = __importDefault(require("../courseLecture/courseLecture.model"));
const mongoose_1 = __importDefault(require("mongoose"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Add course (admin only)
const addCourse = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    let imageUrl = "";
    if (file) {
        const imageName = `${payload.title}-${Date.now()}`;
        const path = file.path;
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
        imageUrl = secure_url;
    }
    const payloadData = Object.assign(Object.assign({}, payload), { imageUrl });
    const result = yield course_model_1.default.create(payloadData);
    return result;
});
// Get all courses
const getAllCourses = (keyword_1, ...args_1) => __awaiter(void 0, [keyword_1, ...args_1], void 0, function* (keyword, page = 1, limit = 10) {
    const query = {};
    if (keyword) {
        query.$or = [
            { title: { $regex: keyword.trim(), $options: "i" } },
            { category: { $regex: keyword.trim(), $options: "i" } },
        ];
    }
    const skip = (page - 1) * limit;
    const [courses, total] = yield Promise.all([
        course_model_1.default.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        course_model_1.default.countDocuments(query),
    ]);
    return {
        meta: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        },
        data: courses,
    };
});
// Get single course by ID
const getSingleCourseById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Course not found");
    }
    return result;
});
// Update course
const updateCourse = (id, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield course_model_1.default.findById(id);
    if (!existing) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Course not found");
    }
    let imageUrl;
    if (file) {
        const imageName = `${(payload === null || payload === void 0 ? void 0 : payload.title) || existing.title}-${Date.now()}`;
        const path = file.path;
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
        imageUrl = secure_url;
    }
    const updatePayload = Object.assign(Object.assign({}, payload), (imageUrl && { imageUrl }));
    const result = yield course_model_1.default.findByIdAndUpdate(id, updatePayload, {
        new: true,
        runValidators: true,
    });
    return result;
});
// Delete course by ID
const deleteCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.default.findById(id);
    if (!course) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Course not found");
    }
    // Delete course image from cloudinary if exists
    if (course.imageUrl) {
        try {
            // Extract public_id from imageUrl
            const parts = course.imageUrl.split("/");
            const filename = parts[parts.length - 1];
            // Remove extension and decode URL
            const publicId = decodeURIComponent(filename.split(".")[0]);
            yield cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch (err) {
            console.error("Error deleting Cloudinary image:", err);
        }
    }
    // Delete course from DB
    const result = yield course_model_1.default.findByIdAndDelete(id);
    return result;
});
const completeLecture = (userId, courseId, lectureId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findById(userId);
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    const purchasedCourse = user.purchasedCourses.find((pc) => pc.courseId.toString() === courseId);
    if (!purchasedCourse) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Course not found in purchased list");
    }
    // Prevent duplicate completion
    const lectureObjectId = new mongoose_1.default.Types.ObjectId(lectureId);
    if (!purchasedCourse.progress.completedLectures.some((id) => id.equals(lectureObjectId))) {
        purchasedCourse.progress.completedLectures.push(lectureObjectId);
    }
    // Fetch total lectures from CourseLecture collection
    const totalLectures = yield courseLecture_model_1.default.countDocuments({ courseId });
    if (totalLectures === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No lectures found for this course");
    }
    // Recalculate percentage
    purchasedCourse.progress.percentage =
        (purchasedCourse.progress.completedLectures.length / totalLectures) * 100;
    yield user.save();
    return purchasedCourse.progress;
});
const completeCourse = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findById(userId);
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    const purchasedCourse = user.purchasedCourses.find((pc) => pc.courseId.toString() === courseId);
    if (!purchasedCourse) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Course not found in purchased list");
    }
    // Fetch total lectures from CourseLecture collection
    const totalLectures = yield courseLecture_model_1.default.countDocuments({ courseId });
    if (totalLectures === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No lectures found for this course");
    }
    // Recalculate percentage
    purchasedCourse.progress.percentage =
        (purchasedCourse.progress.completedLectures.length / totalLectures) * 100;
    // Mark course as completed if all lectures are completed
    if (purchasedCourse.progress.completedLectures.length === totalLectures) {
        purchasedCourse.isCompletedCourse = true;
    }
    yield user.save();
    return purchasedCourse.progress;
});
exports.CourseServices = {
    addCourse,
    getAllCourses,
    getSingleCourseById,
    updateCourse,
    deleteCourse,
    completeLecture,
    completeCourse,
};
