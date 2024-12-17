"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
const mongoose_1 = require("mongoose");
// coupon schema
const couponSchema = new mongoose_1.Schema({
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true },
    minimumOrderAmount: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: null },
    timesUsed: { type: Number, default: 0 },
    vendorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Vendor", default: null },
    createdBy: { type: String, required: true },
}, { timestamps: true });
exports.Coupon = (0, mongoose_1.model)("Coupon", couponSchema);
