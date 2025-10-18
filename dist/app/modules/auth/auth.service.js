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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const auth_utils_1 = require("./auth.utils");
const auth_model_1 = require("./auth.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
const signup = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking if user already exists
    const isUserExistsByEmail = yield auth_model_1.User.findOne({ email: payload.email });
    const isUserExistsByPhoneNumber = yield auth_model_1.User.findOne({
        phoneNumber: payload.phoneNumber,
    });
    if (isUserExistsByEmail) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "User already exists with this email.");
    }
    if (isUserExistsByPhoneNumber) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "User already exists with this phone number.");
    }
    // Generating 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const payloadData = Object.assign(Object.assign({}, payload), { otp, otpExpireAt: new Date(Date.now() + 2 * 60 * 1000) });
    // Creating the user
    const result = yield auth_model_1.User.create(payloadData);
    // Sending OTP
    try {
        const message = `Your verification code is ${otp}. It will expire in 2 minutes.`;
        const smsUrl = `https://sms.mram.com.bd/smsapi?api_key=${config_1.default.sms_provider_api_key}&type=text&contacts=${result.phoneNumber}&senderid=${config_1.default.sms_sender_id}&msg=${encodeURIComponent(message)}`;
        yield axios_1.default.get(smsUrl);
        console.log(smsUrl);
    }
    catch (error) {
        console.error("❌ Failed to send OTP SMS:", error);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to send OTP SMS");
    }
    // 6. Return created user (without OTP)
    const _a = result.toObject(), { otp: _, otpExpireAt: __ } = _a, userWithoutOtp = __rest(_a, ["otp", "otpExpireAt"]);
    return userWithoutOtp;
});
const verifyOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    if (user.isOtpVerified) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already verified.");
    }
    if (!user.otp || user.otp !== otp) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid OTP.");
    }
    if (user.otpExpireAt && user.otpExpireAt < new Date()) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "OTP expired.");
    }
    // Mark verified
    user.isOtpVerified = true;
    user.otp = null;
    user.otpExpireAt = null;
    yield user.save();
    return {
        userId: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isOtpVerified: user.isOtpVerified,
    };
});
// Login
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking if the user exists or not
    const user = yield auth_model_1.User.isUserExists(payload.email);
    if (!(yield user)) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User does not exists.");
    }
    // Checking if the user already deleted or not
    const isUserDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isUserDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User does not exists.");
    }
    // Checking if the user suspended or not
    const isUserSuspended = user === null || user === void 0 ? void 0 : user.isSuspended;
    if (isUserSuspended) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are suspended! Please contact at the support center.");
    }
    if (!user.isOtpVerified) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Your account is not verified.");
    }
    // Checking if the password is correct or not
    if (!(yield auth_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password is not correct.");
    }
    // Create token and send to client/user
    const jwtPayload = {
        _id: user._id.toString(),
        userId: user.userId,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profilePicture: user.profilePicture,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        user: {
            _id: user._id,
            userId: user.userId,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profilePicture: user.profilePicture,
        },
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking if there is any token sent from the client or not.
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to proceed!");
    }
    // Checking if the token is valid or not.
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    const user = yield auth_model_1.User.isUserExists(email);
    // Checking if the user exists or not
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Checking if the user already deleted or not
    const isUserDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isUserDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User does not exists.");
    }
    // Have to check if the user is suspended or not
    const jwtPayload = {
        _id: user._id.toString(),
        userId: user.userId,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
const forgetPassword = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findOne({ phoneNumber });
    if (!user || (user === null || user === void 0 ? void 0 : user.isDeleted)) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    if (!user.isOtpVerified) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Your account is not verified.");
    }
    if (user.isSuspended) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Your account is suspended. Please contact support.");
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpireAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
    yield user.save();
    const message = `Your password reset OTP is ${otp}. It will expire in 2 minutes.`;
    const smsUrl = `https://sms.mram.com.bd/smsapi?api_key=${config_1.default.sms_provider_api_key}&type=text&contacts=${user.phoneNumber}&senderid=${config_1.default.sms_sender_id}&msg=${encodeURIComponent(message)}`;
    yield axios_1.default.get(smsUrl);
    return {};
});
const verifyResetOtp = (phoneNumber, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findOne({ phoneNumber });
    if (!user || (user === null || user === void 0 ? void 0 : user.isDeleted)) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    if (!user.resetOtp || user.resetOtp !== otp) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid OTP");
    }
    if (user.resetOtpExpireAt < new Date()) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "OTP expired");
    }
    user.isResetOtpVerified = true;
    user.resetOtp = null;
    user.resetOtpExpireAt = null;
    yield user.save();
    return {};
});
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findOne({ phoneNumber: payload.phoneNumber });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    if (!user.isOtpVerified) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Your account is not verified.");
    }
    if (user.isSuspended) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Your account is suspended. Please contact support.");
    }
    if (!user.isResetOtpVerified) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "OTP not verified. Please verify OTP before resetting password.");
    }
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_round));
    yield auth_model_1.User.findOneAndUpdate({ phoneNumber: payload.phoneNumber }, {
        password: newHashedPassword,
        passwordChangedAt: new Date(),
        isResetOtpVerified: false,
    });
    return {};
});
const changePassword = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findById(userId).select("+password");
    // Checking if the user exists
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Check if the current password is correct
    const isPasswordMatched = yield bcrypt_1.default.compare(payload.currentPassword, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password is incorrect!");
    }
    // Hash the new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_round));
    yield auth_model_1.User.findByIdAndUpdate(userId, {
        password: newHashedPassword,
    });
});
// Change user role (For admin)
const changeUserRole = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findById(payload === null || payload === void 0 ? void 0 : payload.userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const result = yield auth_model_1.User.findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.userId, { role: payload === null || payload === void 0 ? void 0 : payload.role }, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.AuthServices = {
    signup,
    loginUser,
    refreshToken,
    forgetPassword,
    verifyResetOtp,
    resetPassword,
    changePassword,
    changeUserRole,
    verifyOtp,
};
