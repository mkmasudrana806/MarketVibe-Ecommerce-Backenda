import { Types } from "mongoose";
import { z } from "zod";

// create a review schema
const createAReviewSchema = z.object({
  body: z.object({
    product: z
      .string({ required_error: "Service id is required" })
      .refine((value) => Types.ObjectId.isValid(value), {
        message: "Invalid productId",
      }),
    vendor: z
      .string({ required_error: "Vendor id is required" })
      .refine((value) => Types.ObjectId.isValid(value), {
        message: "Invalid vendorId",
      }),
    rating: z.number().min(1).max(5, "Rating should be between 1 and 5"),
    comment: z.string().optional(),
  }),
});

// update a review schema
const updateAReviewSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .min(1)
      .max(5, "Rating should be between 1 and 5")
      .optional(),
    comment: z.string().optional(),
  }),
});

export const ReviewValidations = {
  createAReviewSchema,
  updateAReviewSchema,
};
