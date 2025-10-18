"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constants_1 = require("../auth/auth.constants");
const job_controller_1 = require("./job.controller");
const router = express_1.default.Router();
router.post("/add", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff), job_controller_1.JobControllers.addJob);
router.get("/", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff, auth_constants_1.UserRole.guardian), job_controller_1.JobControllers.getAllJobs);
router.get("/:id", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff, auth_constants_1.UserRole.user), job_controller_1.JobControllers.getSingleJobById);
router.patch("/update/:id", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.staff, auth_constants_1.UserRole.guardian), job_controller_1.JobControllers.updateJob);
router.delete("/delete/:id", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.guardian), job_controller_1.JobControllers.deleteJob);
exports.JobRoutes = router;
