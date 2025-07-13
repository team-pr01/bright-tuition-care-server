import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

// User Signup
const signup = catchAsync(async (req, res) => {
  // const file = req.file;
  const result = await UserServices.signup(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Registration successful.",
    data: result,
  });
});


export const UserControllers = {
    signup,
}