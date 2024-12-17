"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const coupon_model_1 = require("./coupon.model");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const http_status_1 = __importDefault(require("http-status"));
/**
 * ---------------- Create a coupon ----------------
 *
 * @param userData vendor or admin
 * @param payload coupon data
 * @validations if role 'vendor' then add vendorId else vendorId will be null
 * @return new coupon data
 */
const createCouponIntoDB = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if coupon code already exists
    const existingCoupon = yield coupon_model_1.Coupon.findOne({ code: payload.code });
    if (existingCoupon) {
        throw new Error("Coupon code already exists");
    }
    let result = null;
    // if user role is admin then vendorId is null
    if (userData.role === "admin") {
        payload.createdBy = "admin";
        result = yield coupon_model_1.Coupon.create(payload);
    }
    else {
        payload.vendorId = userData.userId;
        payload.createdBy = "vendor";
        result = yield coupon_model_1.Coupon.create(payload);
    }
    return result;
});
// ---------------- Get all coupons (admin only) ----------------
const getAllCouponsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return coupon_model_1.Coupon.find({});
});
// ------------- Get vendor-specific coupons -------------
const getVendorCouponsFromDB = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    return coupon_model_1.Coupon.find({ vendorId });
});
// ---------------- Validate coupon ----------------
const validateCouponIntoDB = (code, cartTotal, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.Coupon.findOne({ code });
    if (!coupon)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid coupon code");
    if (coupon.expiryDate < new Date())
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Coupon expired");
    if (coupon.timesUsed >= (coupon.usageLimit || Infinity))
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Coupon usage limit reached");
    if (coupon.minimumOrderAmount > cartTotal)
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Minimum order amount not met");
    if (coupon.vendorId && coupon.vendorId.toString() !== vendorId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Coupon not applicable for this vendor");
    }
    const discount = (cartTotal * coupon.discountPercentage) / 100;
    const finalTotal = cartTotal - discount;
    return { isValid: true, discount, finalTotal };
});
exports.CouponService = {
    createCouponIntoDB,
    getAllCouponsFromDB,
    getVendorCouponsFromDB,
    validateCouponIntoDB,
};
