/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { TLoginAuth, TUser } from "./auth.interface";
import AppError from "../../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { createToken } from "./auth.utils";
import { User } from "./auth.model";
import bcrypt from "bcrypt";
import axios from "axios";

const signup = async (payload: Partial<TUser>) => {
  // Checking if user already exists
  const isUserExistsByEmail = await User.findOne({ email: payload.email });
  const isUserExistsByPhoneNumber = await User.findOne({
    phoneNumber: payload.phoneNumber,
  });

  if (isUserExistsByEmail) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User already exists with this email."
    );
  }
  if (isUserExistsByPhoneNumber) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User already exists with this phone number."
    );
  }

  // Generating 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const payloadData = {
    ...payload,
    otp,
    otpExpireAt: new Date(Date.now() + 2 * 60 * 1000), // expires in 2 minutes
  };

  // Creating the user
  const result = await User.create(payloadData);

  // Sending OTP
  try {
    const message = `Your verification code is ${otp}. It will expire in 2 minutes.`;

    const smsUrl = `https://sms.mram.com.bd/smsapi?api_key=${config.sms_provider_api_key}&type=text&contacts=${result.phoneNumber}&senderid=${config.sms_sender_id}&msg=${encodeURIComponent(
      message
    )}`;

    await axios.get(smsUrl);

    console.log(smsUrl);
  } catch (error) {
    console.error("❌ Failed to send OTP SMS:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to send OTP SMS"
    );
  }

  // 6. Return created user (without OTP)
  const { otp: _, otpExpireAt: __, ...userWithoutOtp } = result.toObject();
  return userWithoutOtp;
};

const verifyOtp = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  if (user.isOtpVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already verified.");
  }

  if (!user.otp || user.otp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP.");
  }

  if (user.otpExpireAt && user.otpExpireAt < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP expired.");
  }

  // Mark verified
  user.isOtpVerified = true;
  user.otp = null;
  user.otpExpireAt = null;
  await user.save();

  return {
    userId: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isOtpVerified: user.isOtpVerified,
  };
};

// Login
const loginUser = async (payload: TLoginAuth) => {
  // Checking if the user exists or not
  const user = await User.isUserExists(payload.email);

  if (!(await user)) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exists.");
  }

  // Checking if the user already deleted or not
  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exists.");
  }

  // Checking if the user suspended or not
  const isUserSuspended = user?.isSuspended;
  if (isUserSuspended) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are suspended! Please contact at the support center."
    );
  }

  if (!user.isOtpVerified) {
    throw new AppError(httpStatus.FORBIDDEN, "Your account is not verified.");
  }

  // Checking if the password is correct or not
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is not correct.");
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

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

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
};

const refreshToken = async (token: string) => {
  // Checking if there is any token sent from the client or not.
  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to proceed!"
    );
  }

  // Checking if the token is valid or not.
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { email } = decoded;

  const user = await User.isUserExists(email);

  // Checking if the user exists or not
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Checking if the user already deleted or not
  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exists.");
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

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (phoneNumber: string) => {
  const user = await User.findOne({ phoneNumber });

  if (!user || user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (!user.isOtpVerified) {
    throw new AppError(httpStatus.FORBIDDEN, "Your account is not verified.");
  }

  if (user.isSuspended) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account is suspended. Please contact support."
    );
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetOtp = otp;
  user.resetOtpExpireAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
  await user.save();

  const message = `Your password reset OTP is ${otp}. It will expire in 2 minutes.`;

  const smsUrl = `https://sms.mram.com.bd/smsapi?api_key=${config.sms_provider_api_key}&type=text&contacts=${user.phoneNumber}&senderid=${config.sms_sender_id}&msg=${encodeURIComponent(
    message
  )}`;

  await axios.get(smsUrl);

  return {};
};

const verifyResetOtp = async (phoneNumber: string, otp: string) => {
  const user = await User.findOne({ phoneNumber });

  if (!user || user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (!user.resetOtp || user.resetOtp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  if (user.resetOtpExpireAt! < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP expired");
  }

  user.isResetOtpVerified = true;
  user.resetOtp = null;
  user.resetOtpExpireAt = null;
  await user.save();

  return {};
};

const resetPassword = async (payload: {
  phoneNumber: string;
  newPassword: string;
}) => {
  const user = await User.findOne({ phoneNumber: payload.phoneNumber });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (!user.isOtpVerified) {
    throw new AppError(httpStatus.FORBIDDEN, "Your account is not verified.");
  }

  if (user.isSuspended) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account is suspended. Please contact support."
    );
  }

  if (!user.isResetOtpVerified) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "OTP not verified. Please verify OTP before resetting password."
    );
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round)
  );

  await User.findOneAndUpdate(
    { phoneNumber: payload.phoneNumber },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
      isResetOtpVerified: false,
    }
  );

  return {};
};

const changePassword = async (
  userId: string,
  payload: { currentPassword: string; newPassword: string }
) => {
  const user = await User.findById(userId).select("+password");

  // Checking if the user exists
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Check if the current password is correct
  const isPasswordMatched = await bcrypt.compare(
    payload.currentPassword,
    user.password
  );
  if (!isPasswordMatched) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password is incorrect!"
    );
  }

  // Hash the new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round)
  );
  await User.findByIdAndUpdate(userId, {
    password: newHashedPassword,
  });
};

// Change user role (For admin)
const changeUserRole = async (payload: { userId: string; role: any }) => {
  const user = await User.findById(payload?.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await User.findByIdAndUpdate(
    payload?.userId,
    { role: payload?.role },
    {
      new: true,
      runValidators: true,
    }
  );

  return result;
};

export const AuthServices = {
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
