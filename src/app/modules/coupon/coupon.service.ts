import { JwtPayload } from "jsonwebtoken";
import { TCoupon } from "./coupon.interface";
import { Coupon } from "./coupon.model";
import AppError from "../../utils/AppError";
import httpStatus from "http-status";

/**
 * ---------------- Create a coupon ----------------
 *
 * @param userData vendor or admin
 * @param payload coupon data
 * @validations if role 'vendor' then add vendorId else vendorId will be null
 * @return new coupon data
 */
const createCouponIntoDB = async (userData: JwtPayload, payload: TCoupon) => {
  // check if coupon code already exists
  const existingCoupon = await Coupon.findOne({ code: payload.code });
  if (existingCoupon) {
    throw new Error("Coupon code already exists");
  }

  let result = null;
  // if user role is admin then vendorId is null
  if (userData.role === "admin") {
    payload.createdBy = "admin";
    result = await Coupon.create(payload);
  } else {
    payload.vendorId = userData.userId;
    payload.createdBy = "vendor";
    result = await Coupon.create(payload);
  }

  return result;
};

// ---------------- Get all coupons (admin only) ----------------
const getAllCouponsFromDB = async () => {
  return Coupon.find({});
};

// ------------- Get vendor-specific coupons -------------
const getVendorCouponsFromDB = async (vendorId: string) => {
  return Coupon.find({ vendorId });
};

// ---------------- Validate coupon ----------------
const validateCouponIntoDB = async (
  code: string,
  cartTotal: number,
  vendorId?: string
) => {
  const coupon = await Coupon.findOne({ code });
  if (!coupon)
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid coupon code");
  if (coupon.expiryDate < new Date())
    throw new AppError(httpStatus.BAD_REQUEST, "Coupon expired");
  if (coupon.timesUsed >= (coupon.usageLimit || Infinity))
    throw new AppError(httpStatus.BAD_REQUEST, "Coupon usage limit reached");
  if (coupon.minimumOrderAmount > cartTotal)
    throw new AppError(httpStatus.BAD_REQUEST, "Minimum order amount not met");
  if (coupon.vendorId && coupon.vendorId.toString() !== vendorId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Coupon not applicable for this vendor"
    );
  }

  const discount = (cartTotal * coupon.discountPercentage) / 100;
  const finalTotal = cartTotal - discount;

  return { isValid: true, discount, finalTotal };
};

export const CouponService = {
  createCouponIntoDB,
  getAllCouponsFromDB,
  getVendorCouponsFromDB,
  validateCouponIntoDB,
};
