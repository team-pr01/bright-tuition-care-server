"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CourseSchema = new mongoose_1.Schema({
    imageUrl: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
    tagline: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    benefits: {
        type: [String],
        required: true,
    },
    accessType: {
        type: String,
        required: true,
        enum: ["Lifetime", "Limited"],
    },
    accessValidity: {
        type: Date,
        validate: {
            validator: function (value) {
                if (this.accessType === "Limited" && !value) {
                    return false;
                }
                return true;
            },
            message: "Access Validity is required",
        },
    },
    category: {
        type: String,
        required: true,
    },
    basePrice: {
        type: Number,
        required: true,
    },
    discountedPrice: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
const Course = (0, mongoose_1.model)("Course", CourseSchema);
exports.default = Course;
