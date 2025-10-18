import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { JobServices } from "./job.service";

// Add Job
const addJob = catchAsync(async (req, res) => {
  const result = await JobServices.addJob(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Job added successfully",
    data: result,
  });
});

// Get All Jobs (Infinite Scroll)
const getAllJobs = catchAsync(async (req, res) => {
  const {
    keyword,
    tuitionType,
    category,
    studentGender,
    class: jobClass,
    city,
    area,
    tutoringDays,
    preferredTutorGender,
    skip = "0",
    limit = "10",
  } = req.query;

  const filters = {
    keyword: keyword as string,
    tuitionType: tuitionType as string,
    category: category as string,
    studentGender: studentGender as "male" | "female" | "any",
    class: jobClass as string,
    city: city as string,
    area: area as string,
    tutoringDays: tutoringDays as string,
    preferredTutorGender: preferredTutorGender as "male" | "female" | "any",
  };

  const result = await JobServices.getAllJobs(
    filters,
    Number(skip),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Jobs retrieved successfully",
    data: {
      jobs: result.data,
      meta: result.meta,
    },
  });
});

// Get Single Job by ID
const getSingleJobById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await JobServices.getSingleJobById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job retrieved successfully",
    data: result,
  });
});

// Update Job
const updateJob = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await JobServices.updateJob(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job updated successfully",
    data: result,
  });
});

// Delete Job
const deleteJob = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await JobServices.deleteJob(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job deleted successfully",
    data: result,
  });
});

export const JobControllers = {
  addJob,
  getAllJobs,
  getSingleJobById,
  updateJob,
  deleteJob,
};
