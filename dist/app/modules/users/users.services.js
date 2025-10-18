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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const auth_model_1 = require("../auth/auth.model");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.User.find();
    return result;
});
const getSingleUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.User.findById(userId);
    return result;
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.User.findById(userId);
    return result;
});
const updateProfile = (id, payload, profilePic) => __awaiter(void 0, void 0, void 0, function* () {
    let profilePicUrl;
    if (profilePic) {
        const imageName = `${id}-profile-${Date.now()}`;
        const path = profilePic.path;
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
        profilePicUrl = secure_url;
    }
    if (profilePicUrl) {
        payload.profilePicture = profilePicUrl;
    }
    const result = yield auth_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const suspendUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    user.isSuspended = true;
    yield user.save();
    return user;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.User.findByIdAndDelete(id);
    return result;
});
exports.UserServices = {
    getAllUser,
    getMe,
    deleteUser,
    suspendUser,
    getSingleUserById,
    updateProfile,
};
