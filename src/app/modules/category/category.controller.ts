import httpStatus from "http-status";
import { CategoryServices } from "./category.service";
import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";

// ------------------- Create a category -------------------
const createCategory = asyncHandler(async (req, res) => {
  const result = await CategoryServices.createCategoryInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

// ------------------- Get all categories -------------------
const getAllCategories = asyncHandler(async (req, res) => {
  const result = await CategoryServices.getAllCategoriesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories fetched successfully",
    data: result,
  });
});

// ------------------- Get all public categories -------------------
const getAllPublicCategories = asyncHandler(async (req, res) => {
  const result = await CategoryServices.getAllPublicCategoriesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories fetched successfully",
    data: result,
  });
});

// ------------------- Get a single category -------------------
const getSingleCategory = asyncHandler(async (req, res) => {
  const result = await CategoryServices.getSingleCategoryFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category fetched successfully",
    data: result,
  });
});

// ------------------- Update a category -------------------
const updateCategory = asyncHandler(async (req, res) => {
  const result = await CategoryServices.updateCategoryInDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

// ------------------- Delete a category -------------------
const deleteCategory = asyncHandler(async (req, res) => {
  const result = await CategoryServices.deleteCategoryFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategories,
  getAllPublicCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
