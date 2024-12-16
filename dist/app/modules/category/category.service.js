"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryServices = void 0;
const AppError_1 = __importDefault(require("../../utils/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const category_model_1 = require("./category.model");
/**
 * Create a new category
 * @param payload Category data
 * @returns Newly created category
 */
const createCategoryInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if same category already exists
    const isSameCategoryExists = yield category_model_1.Category.findOne({ name: payload.name });
    if (isSameCategoryExists) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Category already exists");
    }
    const category = yield category_model_1.Category.create(payload);
    return category;
});
/**
 * Get all categories
 * @returns List of all categories
 */
const getAllCategoriesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_model_1.Category.find();
    return categories;
});
/**
 * Get all categories as publicly
 * @returns List of all categories
 */
const getAllPublicCategoriesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_model_1.Category.find({ isDeleted: false });
    return categories;
});
/**
 * Get a single category by ID
 * @param categoryId Category ID
 * @returns Category details
 */
const getSingleCategoryFromDB = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.Category.findById(categoryId);
    if (!category || category.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    return category;
});
/**
 * Update a category
 * @param categoryId Category ID
 * @param payload Updated category data
 * @returns Updated category
 */
const updateCategoryInDB = (categoryId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if same category already exists
    const isSameCategoryExists = yield category_model_1.Category.findOne({ name: payload.name });
    if (isSameCategoryExists) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Category already exists");
    }
    const category = yield category_model_1.Category.findByIdAndUpdate(categoryId, payload, {
        new: true,
    });
    if (!category) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    return category;
});
/**
 * Delete a category
 * @param categoryId Category ID
 */
const deleteCategoryFromDB = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.Category.findByIdAndUpdate(categoryId, {
        isDeleted: true,
    }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    return result;
});
exports.CategoryServices = {
    createCategoryInDB,
    getAllCategoriesFromDB,
    getAllPublicCategoriesFromDB,
    getSingleCategoryFromDB,
    updateCategoryInDB,
    deleteCategoryFromDB,
};
