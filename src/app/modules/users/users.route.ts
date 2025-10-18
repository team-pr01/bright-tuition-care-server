import express from "express";
import { UserControllers } from "./users.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

router.get("/", auth(UserRole.admin), UserControllers.getAllUser);
router.get(
  "/me",
  auth(
    UserRole.user,
    UserRole.admin,
    UserRole.staff,
  ),
  UserControllers.getMe
);
router.get("/:userId", UserControllers.getSingleUserById);

router.put(
  "/update-profile",
  multerUpload.single("file"),
  auth(UserRole.user, UserRole.admin, UserRole.staff),
  UserControllers.updateProfile
);

router.delete(
  "/remove-user/:userId",
  auth("admin"),
  UserControllers.deleteUser
);

export const userRoutes = router;
