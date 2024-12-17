import express from "express";
import auth from "../../middlewares/auth";
import validateRequestData from "../../middlewares/validateRequest";
import { CouponValidationSchema } from "./coupon.validation";
import { CouponController } from "./coupon.controller";
const router = express.Router();

// create coupon
router.post(
  "/create-coupon",
  auth("vendor", "admin"),
  validateRequestData(CouponValidationSchema.createCoupon),
  CouponController.createCoupon
);

// get all coupons (admin only)
router.get("/all", auth("admin"), CouponController.getAllCoupons);

// get vendor specific coupon
router.get("/vendor", auth("vendor"), CouponController.getVendorCoupons);

export const CouponRoutes = router;
