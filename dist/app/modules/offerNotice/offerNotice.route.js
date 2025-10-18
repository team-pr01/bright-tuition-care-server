"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferNoticeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const offerNotice_controller_1 = require("./offerNotice.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constants_1 = require("../auth/auth.constants");
const router = express_1.default.Router();
// Add Offer Notice
router.post("/add", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), offerNotice_controller_1.OfferNoticeControllers.addOfferNotice);
// Get All Offer Notices
router.get("/", offerNotice_controller_1.OfferNoticeControllers.getAllOfferNotices);
// Get Single Offer Notice
router.get("/:offerNoticeId", offerNotice_controller_1.OfferNoticeControllers.getSingleOfferNotice);
// ✏️ Update Offer Notice
router.put("/update/:offerNoticeId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), offerNotice_controller_1.OfferNoticeControllers.updateOfferNotice);
// Delete Offer Notice
router.delete("/delete/:offerNoticeId", (0, auth_1.default)(auth_constants_1.UserRole.admin, auth_constants_1.UserRole.moderator), offerNotice_controller_1.OfferNoticeControllers.deleteOfferNotice);
exports.OfferNoticeRoutes = router;
