"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
// order schema model
const orderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    vendor: { type: mongoose_1.Schema.Types.ObjectId, ref: "Vendor", required: true },
    items: [
        {
            productId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true, min: 0 },
        },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    shippingAddress: { type: String, required: true },
    orderStatus: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending",
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
        required: true,
    },
    orderDate: { type: Date, required: true, default: Date.now() },
    couponCode: { type: String, required: true, default: null },
}, {
    timestamps: true,
});
exports.Order = (0, mongoose_1.model)("Order", orderSchema);
