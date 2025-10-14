import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import Newsletter from "./newsletter.model";
import { TNewsletter } from "./newsletter.interface";

// Add Newsletter
const addNewsletter = async (payload: TNewsletter) => {
  const result = await Newsletter.create(payload);
  return result;
};

// Get all Newsletters
const getAllNewsletters = async () => {
  const result = await Newsletter.find();
  return result;
};

// Get single Newsletter by ID
const getSingleNewsletterById = async (id: string) => {
  const result = await Newsletter.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Newsletter not found");
  }
  return result;
};

// Update Newsletter
const updateNewsletter = async (
  id: string,
  payload: Partial<TNewsletter>
) => {
  const existing = await Newsletter.findById(id);
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Newsletter not found");
  }

  const result = await Newsletter.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete Newsletter
const deleteNewsletter = async (id: string) => {
  const result = await Newsletter.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Newsletter not found");
  }
  return result;
};

export const NewsletterServices = {
  addNewsletter,
  getAllNewsletters,
  getSingleNewsletterById,
  updateNewsletter,
  deleteNewsletter,
};
