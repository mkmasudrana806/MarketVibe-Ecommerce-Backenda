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
exports.PaymentControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_service_1 = require("./payment.service");
// ------------- make payment ----------------
const makePayment = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tnxId, userId, orderId, status } = req === null || req === void 0 ? void 0 : req.query;
    // take action based on status of the payment
    yield payment_service_1.PaymentServices.makePaymentIntoDB(tnxId, userId, orderId, status);
    res.send(`<h1>Payment ${status}</h1>`);
}));
// get all payments history
const allPaymentHistory = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, meta } = yield payment_service_1.PaymentServices.allPaymentsHistoryFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "payments history retrieved successfull",
        data: result,
        meta: meta,
    });
}));
// get user payments history
const userPaymentHistory = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, meta } = yield payment_service_1.PaymentServices.userPaymentsHistoryFromDB(req.user.userId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User payments history retrieved successfull",
        data: result,
        meta: meta,
    });
}));
// get vendor payments history
const vendorPaymentHistory = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, meta } = yield payment_service_1.PaymentServices.vendorPaymentsHistoryFromDB(req.user.userId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Vendor payments history retrieved successfull",
        data: result,
        meta: meta,
    });
}));
exports.PaymentControllers = {
    makePayment,
    allPaymentHistory,
    userPaymentHistory,
    vendorPaymentHistory,
};
