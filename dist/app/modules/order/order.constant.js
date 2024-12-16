"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStatusSequence = exports.searchableFields = void 0;
// search able fields to search
exports.searchableFields = [
    "user.name",
    "vendor.shopName",
    "shippingAddress",
    "paymentStatus",
    "orderStatus",
];
exports.orderStatusSequence = [
    "pending",
    "processing",
    "shipped",
    "delivered",
];
