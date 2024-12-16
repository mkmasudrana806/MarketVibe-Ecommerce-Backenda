import express from "express";
import validateRequestData from "../../middlewares/validateRequest";
import { OrderValidationsSchema } from "./order.validation";
import auth from "../../middlewares/auth";
import { OrderControllers } from "./order.controller";

const router = express.Router();

// create a new order
router.post(
  "/create-order",
  auth("user"),
  validateRequestData(OrderValidationsSchema.createOrder),
  OrderControllers.createOrder
);

// get all orders
router.get("/", auth("admin"), OrderControllers.getAllOrders);

// get all orders for a user
router.get("/user-orders", auth("user"), OrderControllers.getUserOrders);

// get all orders for a vendor
router.get("/vendor-orders", auth("vendor"), OrderControllers.getVendorOrders);

// update order payment status
router.patch(
  "/payment-status/:id",
  auth("vendor"),
  validateRequestData(OrderValidationsSchema.orderPaymentStatusUpdate),
  OrderControllers.updateOrderPaymentStatus
);

// update order payment status
router.patch(
  "/order-status/:id",
  auth("vendor"),
  validateRequestData(OrderValidationsSchema.orderStatusUpdateSchema),
  OrderControllers.updateOrderStatus
);

export const OrderRoutes = router;
