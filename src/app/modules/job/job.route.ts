import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";
import { JobControllers } from "./job.controller";

const router = express.Router();

router.post(
  "/add",
  auth(UserRole.admin, UserRole.staff),
  JobControllers.addJob
);

router.get("/", JobControllers.getAllJobs);

router.get("/:id", JobControllers.getSingleJobById);

router.patch("/update/:id", auth(UserRole.admin, UserRole.staff, UserRole.guardian), JobControllers.updateJob);

router.delete("/delete/:id", auth(UserRole.admin, UserRole.guardian), JobControllers.deleteJob);

export const JobRoutes = router;
