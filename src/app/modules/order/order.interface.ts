import { Types } from "mongoose";

// order interface
type TOrder = {
  user: Types.ObjectId | string;
  vendor: Types.ObjectId;
  items: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  shippingAddress: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  orderDate: Date;
  couponCode: string | null;
};

export default TOrder;
