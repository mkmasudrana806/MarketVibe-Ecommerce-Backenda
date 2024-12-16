"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const category_validation_1 = require("./category.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Create a new category
router.post("/create-category", (0, auth_1.default)("admin"), (0, validateRequest_1.default)(category_validation_1.CategoryValidationsSchema.createCategory), category_controller_1.CategoryControllers.createCategory);
// Get all categories (admin only)
router.get("/", (0, auth_1.default)("admin"), category_controller_1.CategoryControllers.getAllCategories);
// Get all public categories (vendor, user)
router.get("/public", category_controller_1.CategoryControllers.getAllPublicCategories);
// Get a single category by ID
router.get("/:id", category_controller_1.CategoryControllers.getSingleCategory);
// Update a category
router.patch("/:id", (0, auth_1.default)("admin"), (0, validateRequest_1.default)(category_validation_1.CategoryValidationsSchema.updateCategory), category_controller_1.CategoryControllers.updateCategory);
// Delete a category
router.delete("/:id", (0, auth_1.default)("admin"), category_controller_1.CategoryControllers.deleteCategory);
exports.CategoryRoutes = router;
