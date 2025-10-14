import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config";
import { TUser, UserModel } from "./auth.interface";
import crypto from "crypto";

function generateUserId() {
  const prefix = "HFU";
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const random = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6-char random
  return `${prefix}-${date}-${random}`;
}

const userSchema = new Schema<TUser, UserModel>(
  {
    userId: {
      type: String,
      unique: true,
      default: generateUserId,
    },
    avatar: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    pinCode : { type: String, required: false },
    city: { type: String, required: false },
    addressLine1: {
      type: String,
      required: false,
      trim: true,
    },
    addressLine2: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator", "super-admin"],
      default: "user",
    },

    isDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      required: false,
      default: false,
    },
    isOtpVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpireAt: { type: Date },
    passwordChangedAt: {
      type: Date,
      required: false,
    },
    purchasedCourses: [
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    isCompletedCourse: {
      type: Boolean,
      default: false,
    },
    isAttendedOnExam: {
      type: Boolean,
      default: false,
    },
    isPassed: {
      type: Boolean,
      default: false,
    },
    examLimitLeft: {
      type: Number,
      default: 3,
    },
    score: {
      type: Number,
      default: 0,
    },
    progress: {
      completedLectures: [
        {
          type: Schema.Types.ObjectId,
          ref: "CourseLecture",
        },
      ],
      percentage: {
        type: Number,
        default: 0,
      },
    },
  },
]

  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_round)
    );
  }
  next();
});

// Hide password after saving
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

// Static methods
userSchema.statics.isUserExists = async function (email: string) {
  return await this.findOne({ email }).select("+password");
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.index(
  { otpExpireAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { isOtpVerified: false } }
);

// Export the model
export const User = model<TUser, UserModel>("User", userSchema);
