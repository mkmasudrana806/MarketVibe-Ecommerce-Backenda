import { Types } from "mongoose";

// coupon type
export type TCoupon = {
  code: string;
  discountPercentage: number;
  minimumOrderAmount: number;
  expiryDate: Date;
  usageLimit?: number;
  timesUsed: number;
  vendorId?: Types.ObjectId | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};
