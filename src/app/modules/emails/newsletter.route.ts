import express from "express";
import { NewsletterControllers } from "./newsletter.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constannts";

const router = express.Router();

router.post("/subscribe", NewsletterControllers.addNewsletter);
router.get("/", auth(UserRole.admin), NewsletterControllers.getAllNewsletters);
router.get("/:id", auth(UserRole.admin), NewsletterControllers.getSingleNewsletterById);
router.put("/:id", auth(UserRole.admin), NewsletterControllers.updateNewsletter);
router.delete("/:id", auth(UserRole.admin), NewsletterControllers.deleteNewsletter);

export const NewsletterRoutes = router;