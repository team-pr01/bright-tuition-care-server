import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "./auth.constants";
// import { upload } from "../../utils/sendImageToCloudinary";
const router = express.Router();

router.post("/signup", AuthControllers.signup);
router.post("/verify-otp", AuthControllers.verifyOtp);

router.post(
  "/login",
  validateRequest(AuthValidations.LoginValidationSchema),
  AuthControllers.loginUser
);
router.post(
  "/refresh-token",
  validateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

router.post("/forgot-password", AuthControllers.forgetPassword);
router.post("/verify-reset-password-otp", AuthControllers.verifyResetOtp);

router.post(
  "/reset-password",
  validateRequest(AuthValidations.resetPasswordValidationSchema),
  AuthControllers.resetPassword
);

router.post(
  "/change-password",
  auth(UserRole.admin, UserRole.user),
  AuthControllers.changePassword
);

router.put(
  "/change-role",
  auth(UserRole.admin),
  AuthControllers.changeUserRole
);

export const AuthRoute = router;
