import { Schema, model } from "mongoose";
import { TCoupon } from "./coupon.interface";

// coupon schema
const couponSchema = new Schema<TCoupon>(
  {
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true },
    minimumOrderAmount: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: null },
    timesUsed: { type: Number, default: 0 },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", default: null },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const Coupon = model<TCoupon>("Coupon", couponSchema);
