"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const users_route_1 = require("../modules/users/users.route");
const job_route_1 = require("../modules/job/job.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoute,
    },
    {
        path: "/user",
        route: users_route_1.userRoutes,
    },
    {
        path: "/job",
        route: job_route_1.JobRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
