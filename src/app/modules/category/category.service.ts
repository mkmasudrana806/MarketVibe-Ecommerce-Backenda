import { TCategory } from "./category.interface";
import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import { Category } from "./category.model";

/**
 * Create a new category
 * @param payload Category data
 * @returns Newly created category
 */
const createCategoryInDB = async (payload: TCategory) => {
  // check if same category already exists
  const isSameCategoryExists = await Category.findOne({ name: payload.name });
  if (isSameCategoryExists) {
    throw new AppError(httpStatus.CONFLICT, "Category already exists");
  }

  const category = await Category.create(payload);
  return category;
};

/**
 * Get all categories
 * @returns List of all categories
 */
const getAllCategoriesFromDB = async () => {
  const categories = await Category.find();
  return categories;
};

/**
 * Get all categories as publicly
 * @returns List of all categories
 */
const getAllPublicCategoriesFromDB = async () => {
  const categories = await Category.find({ isDeleted: false });
  return categories;
};

/**
 * Get a single category by ID
 * @param categoryId Category ID
 * @returns Category details
 */
const getSingleCategoryFromDB = async (categoryId: string) => {
  const category = await Category.findById(categoryId);
  if (!category || category.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  return category;
};

/**
 * Update a category
 * @param categoryId Category ID
 * @param payload Updated category data
 * @returns Updated category
 */
const updateCategoryInDB = async (
  categoryId: string,
  payload: Partial<TCategory>
) => {
  // check if same category already exists
  const isSameCategoryExists = await Category.findOne({ name: payload.name });
  if (isSameCategoryExists) {
    throw new AppError(httpStatus.CONFLICT, "Category already exists");
  }

  const category = await Category.findByIdAndUpdate(categoryId, payload, {
    new: true,
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  return category;
};

/**
 * Delete a category
 * @param categoryId Category ID
 */
const deleteCategoryFromDB = async (categoryId: string) => {
  const result = await Category.findByIdAndUpdate(
    categoryId,
    {
      isDeleted: true,
    },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  return result;
};

export const CategoryServices = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  getAllPublicCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};
