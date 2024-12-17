"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponValidationSchema = void 0;
const zod_1 = require("zod");
//  create coupon validation schema
const createCoupon = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z
            .string()
            .min(1, "Coupon code is required")
            .regex(/^[A-Z0-9]+$/, "Coupon code must be uppercase alphanumeric"),
        discountPercentage: zod_1.z
            .number()
            .min(1, "Discount percentage must be at least 1%")
            .max(100, "Discount percentage cannot exceed 100%"),
        minimumOrderAmount: zod_1.z
            .number()
            .min(0, "Minimum order amount cannot be negative"),
        expiryDate: zod_1.z.preprocess((arg) => {
            if (typeof arg === "string" || arg instanceof Date)
                return new Date(arg);
        }, zod_1.z.date().min(new Date(), "Expiry date must be in the future")),
        usageLimit: zod_1.z.number().optional().nullable(),
    }),
});
exports.CouponValidationSchema = {
    createCoupon,
};
