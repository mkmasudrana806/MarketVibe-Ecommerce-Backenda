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
const router = express_1.default.Router();
// user
router.use("/users", user_routes_1.UserRoutes);
// auth
router.use("/auth", auth_rotues_1.AuthRoutes);
// products
router.use("/products", product_routes_1.ProductRoutes);
exports.ApiRoutes = router;
