import { Router } from "express";
import { AuthRoute } from "../modules/auth/auth.route";
import { NewsletterRoutes } from "../modules/emails/newsletter.route";
import { userRoutes } from "../modules/users/users.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/newsletter",
    route: NewsletterRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
