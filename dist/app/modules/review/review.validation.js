"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidations = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
// create a review schema
const createAReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        product: zod_1.z
            .string({ required_error: "Service id is required" })
            .refine((value) => mongoose_1.Types.ObjectId.isValid(value), {
            message: "Invalid productId",
        }),
        vendor: zod_1.z
            .string({ required_error: "Vendor id is required" })
            .refine((value) => mongoose_1.Types.ObjectId.isValid(value), {
            message: "Invalid vendorId",
        }),
        rating: zod_1.z.number().min(1).max(5, "Rating should be between 1 and 5"),
        comment: zod_1.z.string().optional(),
    }),
});
// update a review schema
const updateAReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z
            .number()
            .min(1)
            .max(5, "Rating should be between 1 and 5")
            .optional(),
        comment: zod_1.z.string().optional(),
    }),
});
exports.ReviewValidations = {
    createAReviewSchema,
    updateAReviewSchema,
};
