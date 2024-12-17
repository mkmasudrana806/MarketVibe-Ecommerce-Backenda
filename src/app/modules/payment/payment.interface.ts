import { Date, Types } from "mongoose";

// Payment type
export type TPayment = {
  user: Types.ObjectId | string;
  vendor: Types.ObjectId | string;
  order: Types.ObjectId | string;
  email: string;
  amount: number;
  paymentDate: Date;
  paymentStatus: "pending" | "success" | "failed";
  transactionId: string;
};
