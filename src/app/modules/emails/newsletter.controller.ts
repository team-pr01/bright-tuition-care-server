import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { NewsletterServices } from "./newsletter.services";

// Add Newsletter
const addNewsletter = catchAsync(async (req, res) => {
  const result = await NewsletterServices.addNewsletter(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Newsletter created successfully",
    data: result,
  });
});

// Get all Newsletters
const getAllNewsletters = catchAsync(async (req, res) => {
  const result = await NewsletterServices.getAllNewsletters();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Newsletters retrieved successfully",
    data: result,
  });
});

// Get single Newsletter
const getSingleNewsletterById = catchAsync(async (req, res) => {
  const result = await NewsletterServices.getSingleNewsletterById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Newsletter retrieved successfully",
    data: result,
  });
});

// Update Newsletter
const updateNewsletter = catchAsync(async (req, res) => {
  const result = await NewsletterServices.updateNewsletter(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Newsletter updated successfully",
    data: result,
  });
});

// Delete Newsletter
const deleteNewsletter = catchAsync(async (req, res) => {
  const result = await NewsletterServices.deleteNewsletter(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Newsletter deleted successfully",
    data: result,
  });
});

export const NewsletterControllers = {
  addNewsletter,
  getAllNewsletters,
  getSingleNewsletterById,
  updateNewsletter,
  deleteNewsletter,
};
