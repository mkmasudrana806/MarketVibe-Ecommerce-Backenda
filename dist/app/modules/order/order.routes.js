"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const order_validation_1 = require("./order.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
// create a new order
router.post("/create-order", (0, auth_1.default)("user"), (0, validateRequest_1.default)(order_validation_1.OrderValidationsSchema.createOrder), order_controller_1.OrderControllers.createOrder);
// get all orders
router.get("/", (0, auth_1.default)("admin"), order_controller_1.OrderControllers.getAllOrders);
// get all orders for a user
router.get("/user-orders", (0, auth_1.default)("user"), order_controller_1.OrderControllers.getUserOrders);
// get all orders for a vendor
router.get("/vendor-orders", (0, auth_1.default)("vendor"), order_controller_1.OrderControllers.getVendorOrders);
// update order payment status
router.patch("/payment-status/:id", (0, auth_1.default)("vendor"), (0, validateRequest_1.default)(order_validation_1.OrderValidationsSchema.orderPaymentStatusUpdate), order_controller_1.OrderControllers.updateOrderPaymentStatus);
// update order payment status
router.patch("/order-status/:id", (0, auth_1.default)("vendor"), (0, validateRequest_1.default)(order_validation_1.OrderValidationsSchema.orderStatusUpdateSchema), order_controller_1.OrderControllers.updateOrderStatus);
exports.OrderRoutes = router;
