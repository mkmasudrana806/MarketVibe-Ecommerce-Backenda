"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidationsSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
// validation for MongoDB ObjectId
const objectIdValidation = zod_1.z
    .string()
    .refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
    message: "Invalid ObjectId format",
});
// create product zod validation schema
const createProduct = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Product name is required"),
        price: zod_1.z.number().nonnegative("Price must be a non-negative number"),
        category: zod_1.z.string().min(1, "Category ID is required"),
        description: zod_1.z.string().min(1, "Product description is required"),
        tags: zod_1.z.array(zod_1.z.string()),
        inventoryCount: zod_1.z
            .number()
            .int()
            .nonnegative("Inventory count must be a non-negative integer"),
        discount: zod_1.z
            .number()
            .min(0, "Discount must be at least 0")
            .max(100, "Discount cannot exceed 100")
            .optional(),
        vendorId: objectIdValidation,
        flashSale: zod_1.z.boolean().optional(),
        flashSalePrice: zod_1.z
            .number()
            .nonnegative("Flash sale price must be a non-negative number")
            .optional(),
    }),
});
// update product zod validation schema
const updateProduct = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Product name is required").optional(),
        price: zod_1.z
            .number()
            .nonnegative("Price must be a non-negative number")
            .optional(),
        category: zod_1.z.string().min(1, "Category ID is required").optional(),
        description: zod_1.z
            .string()
            .min(1, "Product description is required")
            .optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        inventoryCount: zod_1.z
            .number()
            .int()
            .nonnegative("Inventory count must be a non-negative integer")
            .optional(),
        discount: zod_1.z
            .number()
            .min(0, "Discount must be at least 0")
            .max(100, "Discount cannot exceed 100")
            .optional(),
        flashSale: zod_1.z.boolean().optional(),
        flashSalePrice: zod_1.z
            .number()
            .nonnegative("Flash sale price must be a non-negative number")
            .optional(),
    }),
});
exports.ProductValidationsSchema = {
    createProduct,
    updateProduct,
};
