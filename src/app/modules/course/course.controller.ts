import httpStatus from "http-status";
import { CourseServices } from "./course.services";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

// Add course (For admin)
const addCourse = catchAsync(async (req, res) => {
  const file = req.file;
  const result = await CourseServices.addCourse(req.body, file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course added successfully",
    data: result,
  });
});

// Get all courses
const getAllCourses = catchAsync(async (req, res) => {
  const { keyword, page = "1", limit = "10" } = req.query;
  const result = await CourseServices.getAllCourses(
    keyword as string,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All courses fetched successfully",
    data: {
      courses: result.data,
      pagination: result.meta,
    },
  });
});

// Get single course by ID
const getSingleCourseById = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.getSingleCourseById(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course fetched successfully",
    data: result,
  });
});

// Update course
const updateCourse = catchAsync(async (req, res) => {
  const file = req.file;
  const { courseId } = req.params;
  const result = await CourseServices.updateCourse(courseId, req.body, file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course updated successfully",
    data: result,
  });
});

// Delete course
const deleteCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.deleteCourse(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course deleted successfully",
    data: result,
  });
});

const completeLecture = catchAsync(async (req, res) => {
  const { courseId, lectureId } = req.params;
  const userId = req.user._id;

  const result = await CourseServices.completeLecture(
    userId,
    courseId,
    lectureId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lecture marked as completed & progress updated",
    data: result,
  });
});

const completeCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  const result = await CourseServices.completeCourse(
    userId,
    courseId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course completed successfully",
    data: result,
  });
});

export const CourseControllers = {
  addCourse,
  getAllCourses,
  getSingleCourseById,
  updateCourse,
  deleteCourse,
  completeLecture,
  completeCourse,
};
