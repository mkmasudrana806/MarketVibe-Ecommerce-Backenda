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
exports.OrderServices = void 0;
const order_model_1 = require("./order.model");
const AppError_1 = __importDefault(require("../../utils/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const queryBuilder_1 = __importDefault(require("../../queryBuilder/queryBuilder"));
const order_constant_1 = require("./order.constant");
const payment_utils_1 = require("../payment/payment.utils");
const coupon_service_1 = require("../coupon/coupon.service");
/**
 * create a new order
 * @param payload order data
 * @returns newly created order
 */
const createOrderInDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // if coupon code is applied, again atomic check that coupon is valid
    if (payload.couponCode) {
        const isCouponValid = yield coupon_service_1.CouponService.validateCouponIntoDB(payload.couponCode, payload.totalAmount, payload.vendor.toString());
        if (!isCouponValid.isValid) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Coupon maybe invalid or expired or usage limit exceeded!");
        }
    }
    // set order user
    payload.user = user.userId;
    // save order data to database
    const order = yield order_model_1.Order.create(payload);
    // ------------- payment data
    const tnxId = `tnx-${Date.now()}`;
    const paymentData = {
        email: user.email,
        amount: payload.totalAmount,
        transactionId: tnxId,
    };
    const successUrl = `http://localhost:5000/api/payments/make-payment?tnxId=${tnxId}&userId=${user.userId}&orderId=${order._id}&status=success`;
    const failedUrl = `http://localhost:5000/api/payments/make-payment?tnxId=${tnxId}&userId=${user.userId}&orderId=${order._id}&status=failed`;
    //  initiate amarPay session and return session url
    const session = yield (0, payment_utils_1.initiatePayment)(paymentData, successUrl, failedUrl);
    return session;
});
/**
 * get all orders
 * @returns list of all orders
 */
const getAllOrdersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new queryBuilder_1.default(order_model_1.Order.find(), query)
        .filter()
        .search(order_constant_1.searchableFields)
        .fieldsLimiting()
        .paginate()
        .sort();
    const result = yield orderQuery.modelQuery;
    const meta = yield orderQuery.countTotal();
    return { result, meta };
});
/**
 * get all orders for a user
 * @param userId user id
 * @returns list of orders for the user
 */
const getUserOrdersFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new queryBuilder_1.default(order_model_1.Order.find({ user: userId }), query)
        .filter()
        .search(order_constant_1.searchableFields)
        .fieldsLimiting()
        .paginate()
        .sort();
    const result = yield orderQuery.modelQuery;
    const meta = yield orderQuery.countTotal();
    return { result, meta };
});
/**
 * get all orders for a vendor
 * @param userId user id
 * @returns list of orders for the user
 */
const getVendorOrdersFromDB = (vendorId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new queryBuilder_1.default(order_model_1.Order.find({ vendor: vendorId }), query)
        .filter()
        .search(order_constant_1.searchableFields)
        .fieldsLimiting()
        .paginate()
        .sort();
    const result = yield orderQuery.modelQuery;
    const meta = yield orderQuery.countTotal();
    return { result, meta };
});
/**
 * -------------------- update order payment status ----------------------
 * @param orderId order id
 * @param payload  payment status
 * @returns return updated order data
 */
const updateOrderPaymentStatusIntoDB = (vendorId, orderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findOneAndUpdate({ _id: orderId, vendor: vendorId, paymentStatus: "pending" }, payload, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Already payment status paid or failed`);
    }
    return result;
});
/**
 * -------------------- update order status ----------------------
 * @param orderId order id
 * @param payload  order status
 * @returns return updated order data
 */
const updateOrderStatusIntoDB = (vendorId, orderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findOne({ _id: orderId, vendor: vendorId });
    if (!order) {
        throw new Error("Order not found");
    }
    const currentStatus = order.orderStatus;
    // throw error if current status is not pending, but trying to cancelled
    if (payload.orderStatus === "cancelled") {
        if (currentStatus !== "pending") {
            throw new Error(`Cannot cancel the order. Only orders with status 'pending' can be cancelled.`);
        }
    }
    else {
        // check if status update is valid in the sequence
        const currentIndex = order_constant_1.orderStatusSequence.indexOf(currentStatus);
        const newIndex = order_constant_1.orderStatusSequence.indexOf(payload.orderStatus);
        if (newIndex <= currentIndex) {
            throw new Error(`Cannot update order status to '${payload.orderStatus}'. Current status is '${currentStatus}'`);
        }
    }
    const result = yield order_model_1.Order.findOneAndUpdate({ _id: orderId, vendor: vendorId }, payload, {
        new: true,
        runvalidators: true,
    });
    return result;
});
exports.OrderServices = {
    createOrderInDB,
    getAllOrdersFromDB,
    getUserOrdersFromDB,
    getVendorOrdersFromDB,
    updateOrderPaymentStatusIntoDB,
    updateOrderStatusIntoDB,
};
