import { Types } from "mongoose";
import { z } from "zod";

// validation for MongoDB ObjectId
const objectIdValidation = z
  .string()
  .refine((id) => Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId format",
  });

// create product zod validation schema
const createProduct = z.object({
  body: z.object({
    name: z.string().min(1, "Product name is required"),
    price: z.number().nonnegative("Price must be a non-negative number"),
    category: z.string().min(1, "Category ID is required"),
    description: z.string().min(1, "Product description is required"),
    tags: z.array(z.string()),
    inventoryCount: z
      .number()
      .int()
      .nonnegative("Inventory count must be a non-negative integer"),
    discount: z
      .number()
      .min(0, "Discount must be at least 0")
      .max(100, "Discount cannot exceed 100")
      .optional(),
    vendorId: objectIdValidation,
    flashSale: z.boolean().optional(),
    flashSalePrice: z
      .number()
      .nonnegative("Flash sale price must be a non-negative number")
      .optional(),
  }),
});

// update product zod validation schema
const updateProduct = z.object({
  body: z.object({
    name: z.string().min(1, "Product name is required").optional(),
    price: z
      .number()
      .nonnegative("Price must be a non-negative number")
      .optional(),
    category: z.string().min(1, "Category ID is required").optional(),
    description: z
      .string()
      .min(1, "Product description is required")
      .optional(),
    tags: z.array(z.string()).optional(),
    inventoryCount: z
      .number()
      .int()
      .nonnegative("Inventory count must be a non-negative integer")
      .optional(),
    discount: z
      .number()
      .min(0, "Discount must be at least 0")
      .max(100, "Discount cannot exceed 100")
      .optional(),
    flashSale: z.boolean().optional(),
    flashSalePrice: z
      .number()
      .nonnegative("Flash sale price must be a non-negative number")
      .optional(),
  }),
});

export const ProductValidationsSchema = {
  createProduct,
  updateProduct,
};
