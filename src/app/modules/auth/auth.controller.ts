/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import config from "../../config";

// User Signup
const signup = catchAsync(async (req, res) => {
  const result = await AuthServices.signup(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "We've send OTP to your email. Please verify.",
    data: result,
  });
});

// User Verify OTP
const verifyOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  const result = await AuthServices.verifyOtp(email, otp);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP verified successfully.",
    data: result,
  });
});

// User Login
const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);

  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully.",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New access token generated successfully.",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const email = req.body.email;
  const result = await AuthServices.forgetPassword(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reset password link sent to your email.",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const {token} = req.params;
  const result = await AuthServices.resetPassword(req.body, token as any);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully.",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  await AuthServices.changePassword(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully!",
    data: null,
  });
});

// Change User Role (For admin)
const changeUserRole = catchAsync(async (req, res) => {
  const result = await AuthServices.changeUserRole(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role updated successfully.",
    data: result,
  });
});

export const AuthControllers = {
  signup,
  loginUser,
  refreshToken,
  forgetPassword,
  resetPassword,
  changePassword,
  changeUserRole,
  verifyOtp,
};
