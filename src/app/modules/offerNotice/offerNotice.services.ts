/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import OfferNotice from "./offerNotice.model";
import { TOfferNotice } from "./offerNotice.interface";

// Create Offer Notice
const addOfferNotice = async (payload: TOfferNotice) => {
  const isExist = await OfferNotice.findOne({ title: payload.offerNotice });
  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Offer notice already exists");
  }
  return await OfferNotice.create(payload);
};

// Get All Offer Notices
const getAllOfferNotices = async (keyword?: string, page = 1, limit = 10) => {
  const query: any = {};

  if (keyword) {
    query.$or = [{ offerNotice: { $regex: keyword, $options: "i" } }];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    OfferNotice.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    OfferNotice.countDocuments(query),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get Single Offer Notice
const getSingleOfferNotice = async (id: string) => {
  const result = await OfferNotice.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Offer notice not found");
  }
  return result;
};

// Update Offer Notice
const updateOfferNotice = async (
  id: string,
  payload: Partial<TOfferNotice>
) => {
  const isExist = await OfferNotice.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Offer notice not found");
  }

  return await OfferNotice.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

// Delete Offer Notice
const deleteOfferNotice = async (id: string) => {
  const result = await OfferNotice.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Offer notice not found");
  }
  return result;
};

export const OfferNoticeServices = {
  addOfferNotice,
  getAllOfferNotices,
  getSingleOfferNotice,
  updateOfferNotice,
  deleteOfferNotice,
};
