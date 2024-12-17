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
exports.verifyPayment = exports.initiatePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config"));
// --------------- initiate amarpay payment session ---------------
const initiatePayment = (paymentData, success_url, fail_url) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post(config_1.default.amarpay_payment_url, {
        store_id: config_1.default.amarpay_store_id,
        signature_key: config_1.default.amarpay_signature_key,
        tran_id: paymentData.transactionId,
        success_url: success_url,
        fail_url: fail_url,
        cancel_url: "http://localhost:5000/",
        amount: paymentData.amount,
        currency: "BDT",
        desc: "Merchant Registration Payment",
        cus_name: "N/A",
        cus_email: paymentData.email,
        cus_add1: "N/A",
        cus_add2: "N/A",
        cus_city: "N/A",
        cus_state: "N/A",
        cus_postcode: "N/A",
        cus_country: "Bangladesh",
        cus_phone: "N/A",
        type: "json",
    });
    return response.data;
});
exports.initiatePayment = initiatePayment;
// verify payment
const verifyPayment = (tnxId) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(config_1.default.amarpay_payment_verify_url, {
        params: {
            store_id: config_1.default.amarpay_store_id,
            signature_key: config_1.default.amarpay_signature_key,
            type: "json",
            request_id: tnxId,
        },
    });
    return response.data;
});
exports.verifyPayment = verifyPayment;
