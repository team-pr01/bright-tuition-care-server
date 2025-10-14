export type TLoginAuth = {
  email: string;
  password: string;
};

import { Model, Types } from "mongoose";
import { UserRole } from "./auth.constants";

export type TUser = {
  userId: string;
  _id: string;
  avatar?: string;
  name: string;
  email: string;
  phoneNumber: string;
  pinCode?: string;
  city?: string;
  addressLine1?: string;
  addressLine2?: string;
  password: string;
  role: "user" | "admin" | "moderator";
  isDeleted?: boolean;
  isSuspended?: boolean;
  isOtpVerified?: boolean;
  otp?: string | null;
  otpExpireAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  passwordChangedAt?: Date;
  purchasedCourses: {
    courseId: Types.ObjectId;
    isCompletedCourse?: boolean;
    isAttendedOnExam: boolean;
    isPassed: boolean;
    examLimitLeft: number;
    score: number;
    progress?: {
      completedLectures: Types.ObjectId[];
      percentage: number;
    };
  }[];
};

export interface UserModel extends Model<TUser> {
  isUserExists(email: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof UserRole;
