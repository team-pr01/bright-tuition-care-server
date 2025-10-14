import express from "express";
import { CourseControllers } from "./course.controller";
import { multerUpload } from "../../../config/multer.config";
import auth from "../../../middlewares/auth";
import { UserRole } from "../../auth/auth.constants";

const router = express.Router();

// For admin only
router.post(
  "/add",
  auth(UserRole.admin, UserRole.moderator),
  multerUpload.single("file"),
  CourseControllers.addCourse
);

router.get("/", CourseControllers.getAllCourses);
router.get("/:courseId", CourseControllers.getSingleCourseById);


router.put(
  "/:courseId/lectures/:lectureId/complete",
  auth(UserRole.user),
  CourseControllers.completeLecture
);

router.put(
  "/:courseId/complete",
  auth(UserRole.user),
  CourseControllers.completeCourse
);

router.put(
  "/update/:courseId",
  auth(UserRole.admin, UserRole.moderator),
  multerUpload.single("file"),
  CourseControllers.updateCourse
);

router.delete(
  "/delete/:courseId",
  auth(UserRole.admin, UserRole.moderator),
  CourseControllers.deleteCourse
);

export const CourseRoutes = router;
