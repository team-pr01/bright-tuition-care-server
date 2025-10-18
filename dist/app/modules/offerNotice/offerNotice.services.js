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
exports.OfferNoticeServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const offerNotice_model_1 = __importDefault(require("./offerNotice.model"));
// Create Offer Notice
const addOfferNotice = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield offerNotice_model_1.default.findOne({ title: payload.offerNotice });
    if (isExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Offer notice already exists");
    }
    return yield offerNotice_model_1.default.create(payload);
});
// Get All Offer Notices
const getAllOfferNotices = (keyword_1, ...args_1) => __awaiter(void 0, [keyword_1, ...args_1], void 0, function* (keyword, page = 1, limit = 10) {
    const query = {};
    if (keyword) {
        query.$or = [{ offerNotice: { $regex: keyword, $options: "i" } }];
    }
    const skip = (page - 1) * limit;
    const [data, total] = yield Promise.all([
        offerNotice_model_1.default.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        offerNotice_model_1.default.countDocuments(query),
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
});
// Get Single Offer Notice
const getSingleOfferNotice = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield offerNotice_model_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Offer notice not found");
    }
    return result;
});
// Update Offer Notice
const updateOfferNotice = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield offerNotice_model_1.default.findById(id);
    if (!isExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Offer notice not found");
    }
    return yield offerNotice_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
});
// Delete Offer Notice
const deleteOfferNotice = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield offerNotice_model_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Offer notice not found");
    }
    return result;
});
exports.OfferNoticeServices = {
    addOfferNotice,
    getAllOfferNotices,
    getSingleOfferNotice,
    updateOfferNotice,
    deleteOfferNotice,
};
