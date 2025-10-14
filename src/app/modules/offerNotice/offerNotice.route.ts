import express from "express";
import { OfferNoticeControllers } from "./offerNotice.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constants";

const router = express.Router();

// Add Offer Notice
router.post(
  "/add",
  auth(UserRole.admin, UserRole.moderator),
  OfferNoticeControllers.addOfferNotice
);

// Get All Offer Notices
router.get("/", OfferNoticeControllers.getAllOfferNotices);

// Get Single Offer Notice
router.get("/:offerNoticeId", OfferNoticeControllers.getSingleOfferNotice);

// ✏️ Update Offer Notice
router.put(
  "/update/:offerNoticeId",
  auth(UserRole.admin, UserRole.moderator),
  OfferNoticeControllers.updateOfferNotice
);

// Delete Offer Notice
router.delete(
  "/delete/:offerNoticeId",
  auth(UserRole.admin, UserRole.moderator),
  OfferNoticeControllers.deleteOfferNotice
);

export const OfferNoticeRoutes = router;
