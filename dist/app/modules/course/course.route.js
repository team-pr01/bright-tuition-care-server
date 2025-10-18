"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("./course.controller");
const multer_config_1 = require("../../../config/multer.config");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const auth_constants_1 = require("../../auth/auth.constants");
const router = express_1.default.Router();
// For admin only
router.post("/add", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), multer_config_1.multerUpload.single("file"), course_controller_1.CourseControllers.addCourse);
router.get("/", course_controller_1.CourseControllers.getAllCourses);
router.get("/:courseId", course_controller_1.CourseControllers.getSingleCourseById);
router.put("/:courseId/lectures/:lectureId/complete", (0, auth_1.default)(auth_constants_1.UserRole.user), course_controller_1.CourseControllers.completeLecture);
router.put("/:courseId/complete", (0, auth_1.default)(auth_constants_1.UserRole.user), course_controller_1.CourseControllers.completeCourse);
router.put("/update/:courseId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), multer_config_1.multerUpload.single("file"), course_controller_1.CourseControllers.updateCourse);
router.delete("/delete/:courseId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), course_controller_1.CourseControllers.deleteCourse);
exports.CourseRoutes = router;
