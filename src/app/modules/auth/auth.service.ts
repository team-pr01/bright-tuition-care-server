/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { TLoginAuth, TUser } from "./auth.interface";
import AppError from "../../errors/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { createToken } from "./auth.utils";
import { User } from "./auth.model";
import { sendEmail } from "../../utils/sendEmail";
import bcrypt from "bcrypt";
import axios from "axios";

const signup = async (payload: Partial<TUser>) => {
  // 1. Check if user already exists
  const isUserExistsByEmail = await User.findOne({ email: payload.email });
  const isUserExistsByPhoneNumber = await User.findOne({
    phoneNumber: payload.phoneNumber,
  });

  if (isUserExistsByEmail) {
    throw new AppError(httpStatus.CONFLICT, "User already exists with this email.");
  }
  if (isUserExistsByPhoneNumber) {
    throw new AppError(httpStatus.CONFLICT, "User already exists with this phone number.");
  }

  // 2. Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 3. Prepare user data
  const payloadData = {
    ...payload,
    otp,
    otpExpireAt: new Date(Date.now() + 2 * 60 * 1000), // expires in 2 minutes
  };

  // 4. Create user
  const result = await User.create(payloadData);

  // 5. Send OTP via MRAM SMS API
  try {
    const message = `Your verification code is ${otp}. It will expire in 2 minutes.`;

    const smsUrl = `https://sms.mram.com.bd/smsapi?api_key=${config.sms_provider_api_key}&type=text&contacts=${result.phoneNumber}&senderid=${config.sms_sender_id}&msg=${encodeURIComponent(
      message
    )}`;

    await axios.get(smsUrl);

    console.log(smsUrl);
  } catch (error) {
    console.error("❌ Failed to send OTP SMS:", error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to send OTP SMS");
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

const forgetPassword = async (email: string) => {
  const user = await User.isUserExists(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (!user.isOtpVerified) {
    throw new AppError(httpStatus.FORBIDDEN, "Your account is not verified.");
  }

  const jwtPayload = {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m"
  );

  const resetLink = `${config.reset_password_ui_url}/reset-password?email=${user?.email}&token=${resetToken}`;

  const subject = "Reset Your Password - Hanjifinance";

  const htmlBody = `
  <div style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color:#c0392b; text-align:center;">Hanjifinance</h2>
      <p style="font-size:16px; color:#333;">Hello <strong>${user.name}</strong>,</p>
      <p style="font-size:15px; color:#555;">
        We received a request to reset your password for your Hanjifinance account.  
        Please click the button below to reset your password. This link will expire in <strong>10 minutes</strong>.
      </p>
      <div style="text-align:center; margin:30px 0;">
        <a href="${resetLink}" target="_blank" style="background:#c0392b; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-size:16px; font-weight:bold;">
          Reset Password
        </a>
      </div>
      <p style="font-size:14px; color:#777;">
        If you did not request this, you can safely ignore this email.  
        Your password will remain unchanged.
      </p>
      <p style="font-size:15px; color:#333; margin-top:30px;">Best regards,</p>
      <p style="font-size:16px; font-weight:bold; color:#c0392b;">The Hanjifinance Team</p>
    </div>
  </div>
  `;

  await sendEmail(user.email, subject, htmlBody);
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string
) => {
  const user = await User.isUserExists(payload?.email);

  // Checking if the user exists or not
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  // Checking if the user's account is verified or not
  if (!user.isOtpVerified) {
    throw new AppError(httpStatus.FORBIDDEN, "Your account is not verified.");
  }

  // Check if the token is valid or not.
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;

  if (payload?.email !== decoded?.email) {
    throw new AppError(httpStatus.FORBIDDEN, "You are forbidden");
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round)
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );
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
      "Current password is incorrect!"
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
  resetPassword,
  changePassword,
  changeUserRole,
  verifyOtp,
};
