"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const coupon_validation_1 = require("./coupon.validation");
const coupon_controller_1 = require("./coupon.controller");
const router = express_1.default.Router();
// create coupon
router.post("/create-coupon", (0, auth_1.default)("vendor", "admin"), (0, validateRequest_1.default)(coupon_validation_1.CouponValidationSchema.createCoupon), coupon_controller_1.CouponController.createCoupon);
// get all coupons (admin only)
router.get("/all", (0, auth_1.default)("admin"), coupon_controller_1.CouponController.getAllCoupons);
// get vendor specific coupon
router.get("/vendor", (0, auth_1.default)("vendor"), coupon_controller_1.CouponController.getVendorCoupons);
exports.CouponRoutes = router;
