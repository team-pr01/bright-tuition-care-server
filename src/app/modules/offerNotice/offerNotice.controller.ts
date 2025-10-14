import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { OfferNoticeServices } from "./offerNotice.services";

// Add Offer Notice
const addOfferNotice = catchAsync(async (req, res) => {
  const result = await OfferNoticeServices.addOfferNotice(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Offer notice added successfully",
    data: result,
  });
});

// Get All Offer Notices
const getAllOfferNotices = catchAsync(async (req, res) => {
  const { page = "1", limit = "10", keyword } = req.query;

  const result = await OfferNoticeServices.getAllOfferNotices(
    keyword as string,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offer notices retrieved successfully",
    data: {
      offerNotices: result.data,
      pagination: result.meta,
    },
  });
});

// Get Single Offer Notice
const getSingleOfferNotice = catchAsync(async (req, res) => {
  const { offerNoticeId } = req.params;
  const result = await OfferNoticeServices.getSingleOfferNotice(offerNoticeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offer notice retrieved successfully",
    data: result,
  });
});

// Update Offer Notice
const updateOfferNotice = catchAsync(async (req, res) => {
  const { offerNoticeId } = req.params;
  const result = await OfferNoticeServices.updateOfferNotice(
    offerNoticeId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offer notice updated successfully",
    data: result,
  });
});

// Delete Offer Notice
const deleteOfferNotice = catchAsync(async (req, res) => {
  const { offerNoticeId } = req.params;
  const result = await OfferNoticeServices.deleteOfferNotice(offerNoticeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offer notice deleted successfully",
    data: result,
  });
});

export const OfferNoticeControllers = {
  addOfferNotice,
  getAllOfferNotices,
  getSingleOfferNotice,
  updateOfferNotice,
  deleteOfferNotice,
};
