import { z } from "zod";

//  create coupon validation schema
const createCoupon = z.object({
  body: z.object({
    code: z
      .string()
      .min(1, "Coupon code is required")
      .regex(/^[A-Z0-9]+$/, "Coupon code must be uppercase alphanumeric"),
    discountPercentage: z
      .number()
      .min(1, "Discount percentage must be at least 1%")
      .max(100, "Discount percentage cannot exceed 100%"),
    minimumOrderAmount: z
      .number()
      .min(0, "Minimum order amount cannot be negative"),
    expiryDate: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date().min(new Date(), "Expiry date must be in the future")),
    usageLimit: z.number().optional().nullable(),
  }),
});

export const CouponValidationSchema = {
  createCoupon,
};
