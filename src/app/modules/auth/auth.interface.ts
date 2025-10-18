export type TLoginAuth = {
  email: string;
  password: string;
};

import { Model } from "mongoose";
import { UserRole } from "./auth.constants";

export type TUser = {
  _id: string;
  userId: string;
  profilePicture?: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  city: string;
  area: string;
  password: string;
  role: "user" | "admin" | "staff";
  isDeleted?: boolean;
  isSuspended?: boolean;
  isOtpVerified?: boolean;
  otp?: string | null;
  otpExpireAt?: Date | null;
  resetOtp?: string | null;
  resetOtpExpireAt?: Date | null;
  isResetOtpVerified?: boolean | null;
  createdAt?: Date;
  updatedAt?: Date;
  passwordChangedAt?: Date;
};

export interface UserModel extends Model<TUser> {
  isUserExists(email: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof UserRole;
