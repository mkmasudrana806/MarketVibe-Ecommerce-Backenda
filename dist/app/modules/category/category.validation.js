"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidationsSchema = void 0;
const zod_1 = require("zod");
// create category validation schema
const createCategory = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Category name is required"),
        description: zod_1.z.string().optional(),
    }),
});
// update category validation schema
const updateCategory = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Category name is required").optional(),
        description: zod_1.z.string().optional(),
    }),
});
exports.CategoryValidationsSchema = {
    createCategory,
    updateCategory,
};
