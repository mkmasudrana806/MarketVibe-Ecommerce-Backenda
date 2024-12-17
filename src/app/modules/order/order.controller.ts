import httpStatus from "http-status";

import asyncHandler from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.service";

// ------------------- Create an order -------------------
const createOrder = asyncHandler(async (req, res) => {
  const result = await OrderServices.createOrderInDB(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

// ------------------- Get all orders -------------------
const getAllOrders = asyncHandler(async (req, res) => {
  const result = await OrderServices.getAllOrdersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders fetched successfully",
    data: result,
  });
});

// ------------------- Get all orders for a user -------------------
const getUserOrders = asyncHandler(async (req, res) => {
  const result = await OrderServices.getUserOrdersFromDB(
    req.user.userId,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User orders fetched successfully",
    data: result,
  });
});

// ------------------- Get all orders for a vendor -------------------
const getVendorOrders = asyncHandler(async (req, res) => {
  const result = await OrderServices.getVendorOrdersFromDB(
    req.user.userId,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vendor orders fetched successfully",
    data: result,
  });
});

// ------------------- update order payment status -------------------
const updateOrderPaymentStatus = asyncHandler(async (req, res) => {
  const result = await OrderServices.updateOrderPaymentStatusIntoDB(
    req.user.userId,
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order payment status changed successfully",
    data: result,
  });
});

// ------------------- update order status -------------------
const updateOrderStatus = asyncHandler(async (req, res) => {
  const result = await OrderServices.updateOrderStatusIntoDB(
    req.user.userId,
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order status changed successfully",
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  getAllOrders,
  getUserOrders,
  getVendorOrders,
  updateOrderPaymentStatus,
  updateOrderStatus,
};
