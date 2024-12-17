"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
// mongoose payment schema
const paymentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    vendor: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Vendor" },
    order: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Order" },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true, default: new Date() },
    paymentStatus: {
        type: String,
        required: true,
        enum: ["pending", "success", "failed"],
        default: "pending",
    },
    transactionId: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
