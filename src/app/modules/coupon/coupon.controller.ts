import httpStatus from "http-status";
import asyncHanlder from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { CouponService } from "./coupon.service";

// ------------------- create a coupon -------------------
const createCoupon = asyncHanlder(async (req, res) => {
  const result = await CouponService.createCouponIntoDB(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon created successfully",
    data: result,
  });
});

// ------------------- get all coupons -------------------
const getAllCoupons = asyncHanlder(async (req, res) => {
  const result = await CouponService.getAllCouponsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All coupons fetched successfully",
    data: result,
  });
});

// ------------------- get all coupons -------------------
const getVendorCoupons = asyncHanlder(async (req, res) => {
  const result = await CouponService.getVendorCouponsFromDB(req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All coupons fetched successfully",
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  getAllCoupons,
  getVendorCoupons,
};
