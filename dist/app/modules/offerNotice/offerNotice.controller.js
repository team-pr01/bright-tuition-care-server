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
exports.OfferNoticeControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const offerNotice_services_1 = require("./offerNotice.services");
// Add Offer Notice
const addOfferNotice = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield offerNotice_services_1.OfferNoticeServices.addOfferNotice(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Offer notice added successfully",
        data: result,
    });
}));
// Get All Offer Notices
const getAllOfferNotices = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = "1", limit = "10", keyword } = req.query;
    const result = yield offerNotice_services_1.OfferNoticeServices.getAllOfferNotices(keyword, Number(page), Number(limit));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Offer notices retrieved successfully",
        data: {
            offerNotices: result.data,
            pagination: result.meta,
        },
    });
}));
// Get Single Offer Notice
const getSingleOfferNotice = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { offerNoticeId } = req.params;
    const result = yield offerNotice_services_1.OfferNoticeServices.getSingleOfferNotice(offerNoticeId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Offer notice retrieved successfully",
        data: result,
    });
}));
// Update Offer Notice
const updateOfferNotice = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { offerNoticeId } = req.params;
    const result = yield offerNotice_services_1.OfferNoticeServices.updateOfferNotice(offerNoticeId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Offer notice updated successfully",
        data: result,
    });
}));
// Delete Offer Notice
const deleteOfferNotice = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { offerNoticeId } = req.params;
    const result = yield offerNotice_services_1.OfferNoticeServices.deleteOfferNotice(offerNoticeId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Offer notice deleted successfully",
        data: result,
    });
}));
exports.OfferNoticeControllers = {
    addOfferNotice,
    getAllOfferNotices,
    getSingleOfferNotice,
    updateOfferNotice,
    deleteOfferNotice,
};
