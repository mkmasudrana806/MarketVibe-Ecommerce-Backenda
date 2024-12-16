"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/user/user.routes");
const auth_rotues_1 = require("../modules/auth/auth.rotues");
const product_routes_1 = require("../modules/product/product.routes");
const vendor_routes_1 = require("../modules/vendor/vendor.routes");
const order_routes_1 = require("../modules/order/order.routes");
const review_routes_1 = require("../modules/review/review.routes");
const category_routes_1 = require("../modules/category/category.routes");
const router = express_1.default.Router();
// user
router.use("/users", user_routes_1.UserRoutes);
// auth
router.use("/auth", auth_rotues_1.AuthRoutes);
// products
router.use("/products", product_routes_1.ProductRoutes);
// vendors
router.use("/vendors", vendor_routes_1.VendorRoutes);
// orders
router.use("/orders", order_routes_1.OrderRoutes);
// reviews
router.use("/reviews", review_routes_1.ReviewRoutes);
// categories
router.use("/categories", category_routes_1.CategoryRoutes);
exports.ApiRoutes = router;
