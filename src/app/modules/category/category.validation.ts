import { z } from "zod";

// create category validation schema
const createCategory = z.object({
  body: z.object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
  }),
});

// update category validation schema
const updateCategory = z.object({
  body: z.object({
    name: z.string().min(1, "Category name is required").optional(),
    description: z.string().optional(),
  }),
});

export const CategoryValidationsSchema = {
  createCategory,
  updateCategory,
};
