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
exports.PaymentServices = void 0;
const payment_model_1 = require("./payment.model");
const payment_utils_1 = require("./payment.utils");
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const order_model_1 = require("../order/order.model");
const queryBuilder_1 = __importDefault(require("../../queryBuilder/queryBuilder"));
const payment_constant_1 = require("./payment.constant");
const coupon_model_1 = require("../coupon/coupon.model");
/**
 * --------------- make payment ---------------
 *
 * @param tnxId transaction id of the session
 * @param userId id of the user who owns the transaction
 * @param orderId order id of the order that owns the transaction
 * @param status  status of the transaction
 * @returns nothing
 */
const makePaymentIntoDB = (tnxId, userId, orderId, status) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user belong to the order
    const isUserBelong = yield order_model_1.Order.findOne({ _id: orderId, user: userId });
    if (!isUserBelong) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are not belong to that order");
    }
    // if payment failed, then update paymentStatus to 'failed' in order collection
    if (status === "failed") {
        yield order_model_1.Order.findOneAndUpdate({ _id: orderId, user: userId }, { paymentStatus: "failed" });
        return;
    }
    // if payment success, then take below action
    // verify payment in amarpay database
    const isPaidtoAmarpay = yield (0, payment_utils_1.verifyPayment)(tnxId);
    // if paid and pay_status 'Successful' then update paymentStatus to 'paid'
    // and create a record into 'Payment' collection
    if (isPaidtoAmarpay && isPaidtoAmarpay.pay_status === "Successful") {
        const session = yield mongoose_1.default.startSession();
        try {
            // start transaction
            session.startTransaction();
            // update paymentStatus in Order
            const updatedOrderData = yield order_model_1.Order.findOneAndUpdate({ _id: orderId }, { paymentStatus: "paid" }, { runValidators: true, session, new: true });
            if (!updatedOrderData) {
                throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Faild to update paymentStatus in order");
            }
            // create a record into 'Payment' collection
            const paymentData = {
                user: userId,
                vendor: updatedOrderData.vendor,
                order: orderId,
                amount: updatedOrderData.totalAmount,
                paymentStatus: "success",
                transactionId: tnxId,
            };
            yield payment_model_1.Payment.create(paymentData);
            // update coupon usage limit if this order contain any coupon code
            if (updatedOrderData.couponCode) {
                yield coupon_model_1.Coupon.findOneAndUpdate({ code: updatedOrderData.couponCode }, { $inc: { timesUsed: 1 } }, { session });
            }
            yield session.commitTransaction();
            yield session.endSession();
        }
        catch (error) {
            yield session.abortTransaction();
            yield session.endSession();
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Faild to make payment");
        }
    }
});
/**
 * --------------- get all payments history ---------------
 *
 * @param query req.query object containing query parameters
 * @returns all payments history
 */
const allPaymentsHistoryFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentQuery = new queryBuilder_1.default(payment_model_1.Payment.find(), query)
        .filter()
        .search(payment_constant_1.searchableFields)
        .fieldsLimiting()
        .paginate()
        .sort();
    const result = yield paymentQuery.modelQuery;
    const meta = yield paymentQuery.countTotal();
    return { result, meta };
});
// get user payments history
const userPaymentsHistoryFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentQuery = new queryBuilder_1.default(payment_model_1.Payment.find({ user: userId }), query)
        .filter()
        .search(payment_constant_1.searchableFields)
        .fieldsLimiting()
        .paginate()
        .sort();
    const result = yield paymentQuery.modelQuery;
    const meta = yield paymentQuery.countTotal();
    return { result, meta };
});
// get vendor payments history
const vendorPaymentsHistoryFromDB = (vendorId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentQuery = new queryBuilder_1.default(payment_model_1.Payment.find({ vendor: vendorId }), query)
        .filter()
        .search(payment_constant_1.searchableFields)
        .fieldsLimiting()
        .paginate()
        .sort();
    const result = yield paymentQuery.modelQuery;
    const meta = yield paymentQuery.countTotal();
    return { result, meta };
});
exports.PaymentServices = {
    makePaymentIntoDB,
    allPaymentsHistoryFromDB,
    userPaymentsHistoryFromDB,
    vendorPaymentsHistoryFromDB,
};
