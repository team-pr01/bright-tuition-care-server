// users.controller.ts
import { UserServices } from './users.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUser();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const result = await UserServices.getMe(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const getMyOrders = catchAsync(async (req, res) => {
  // const userId = req.user.userId;
  const {userId} = req.params;
  const result = await UserServices.getMyOrders(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});


const changeUserRoleToAdmin = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.changeUserRoleToAdmin(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User role updated to admin successfully',
    data: result,
  });
});

const changeUserRoleToUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.changeUserRoleToUser(userId);


  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User role updated to admin successfully',
    data: result,
  });
});

const suspendUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.suspendUser(userId);


  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User suspended',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.deleteUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted succesfully',
    data: result,
  });
});

// Get single post by ID
const getSingleUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.getSingleUserById(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User data fetched successfully.',
    data: result,
  });
});


// Update profile
const updateProfile = catchAsync(async (req, res) => {
  const file = req.file;
  const userId = req.user._id;
  const result = await UserServices.updateProfile(userId, req.body, file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

export const UserControllers = {
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
