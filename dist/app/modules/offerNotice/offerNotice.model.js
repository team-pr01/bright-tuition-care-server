"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OfferNoticeSchema = new mongoose_1.Schema({
    offerNotice: { type: String, required: true, trim: true },
}, {
    timestamps: true,
});
const OfferNotice = (0, mongoose_1.model)("OfferNotice", OfferNoticeSchema);
exports.default = OfferNotice;
