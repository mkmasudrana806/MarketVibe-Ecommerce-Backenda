import { model, Schema } from "mongoose";
import { TPayment } from "./payment.interface";

// mongoose payment schema
const paymentSchema = new Schema<TPayment>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    vendor: { type: Schema.Types.ObjectId, required: true, ref: "Vendor" },
    order: { type: Schema.Types.ObjectId, required: true, ref: "Order" },
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
  },
  { timestamps: true }
);

export const Payment = model("Payment", paymentSchema);
