// import prisma from "../../prismaClient";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();
const signup = async (payload: Partial<any>) => {
  const { name, email, phoneNumber, password, role } = payload;

  // Basic validation (optional but recommended)
  if (!email || !password || !name) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Name, email and password are required."
    );
  }

  // Check if user exists
  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExists) {
    throw new AppError(httpStatus.CONFLICT, "User already exists.");
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log({hashedPassword});

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUserData = await transactionClient.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
      },
    });
  });

  return result;
};

export const UserServices = {
  signup,
};
