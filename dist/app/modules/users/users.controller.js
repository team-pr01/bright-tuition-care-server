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
exports.UserControllers = void 0;
// users.controller.ts
const users_services_1 = require("./users.services");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const getAllUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users_services_1.UserServices.getAllUser();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
}));
const getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const result = yield users_services_1.UserServices.getMe(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Profile retrieved successfully',
        data: result,
    });
}));
const getMyOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const userId = req.user.userId;
    const { userId } = req.params;
    const result = yield users_services_1.UserServices.getMyOrders(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Orders retrieved successfully',
        data: result,
    });
}));
const changeUserRoleToAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield users_services_1.UserServices.changeUserRoleToAdmin(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User role updated to admin successfully',
        data: result,
    });
}));
const changeUserRoleToUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield users_services_1.UserServices.changeUserRoleToUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User role updated to admin successfully',
        data: result,
    });
}));
const suspendUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield users_services_1.UserServices.suspendUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User suspended',
        data: result,
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield users_services_1.UserServices.deleteUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User deleted succesfully',
        data: result,
    });
}));
// Get single post by ID
const getSingleUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield users_services_1.UserServices.getSingleUserById(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User data fetched successfully.',
        data: result,
    });
}));
// Update profile
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const userId = req.user._id;
    const result = yield users_services_1.UserServices.updateProfile(userId, req.body, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
}));
exports.UserControllers = {
    getAllUser,
    getMe,
    deleteUser,
    changeUserRoleToAdmin,
    changeUserRoleToUser,
    suspendUser,
    getSingleUserById,
    getMyOrders,
    updateProfile,
};
