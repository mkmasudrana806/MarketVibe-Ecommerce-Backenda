import express from "express";
import { CategoryControllers } from "./category.controller";
import validateRequestData from "../../middlewares/validateRequest";
import { CategoryValidationsSchema } from "./category.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

// Create a new category
router.post(
  "/create-category",
  auth("admin"),
  validateRequestData(CategoryValidationsSchema.createCategory),
  CategoryControllers.createCategory
);

// Get all categories (admin only)
router.get("/", auth("admin"), CategoryControllers.getAllCategories);

// Get all public categories (vendor, user)
router.get("/public", CategoryControllers.getAllPublicCategories);

// Get a single category by ID
router.get("/:id", CategoryControllers.getSingleCategory);

// Update a category
router.patch(
  "/:id",
  auth("admin"),
  validateRequestData(CategoryValidationsSchema.updateCategory),
  CategoryControllers.updateCategory
);

// Delete a category
router.delete("/:id", auth("admin"), CategoryControllers.deleteCategory);

export const CategoryRoutes = router;
