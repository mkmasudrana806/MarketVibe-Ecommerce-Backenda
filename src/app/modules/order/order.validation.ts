import { Types } from "mongoose";
import { INVALID, z } from "zod";

// create order validation schema
const createOrder = z.object({
  body: z.object({
    vendor: z.string().refine((id) => Types.ObjectId.isValid(id), {
      message: "Vendor is not valid",
    }),
    items: z.array(
      z.object({
        productId: z.string().refine((id) => Types.ObjectId.isValid(id), {
          message: "Invalid product id format",
        }),
        quantity: z.number().int().positive("Quantity must be positive"),
        price: z.number().nonnegative("Price must be a positive number"),
      })
    ),
    shippingAddress: z.string({
      required_error: "Shipping address is required",
      invalid_type_error: "Shipping address must be a valid string",
    }),
  }),
});

// order payment status update
const orderPaymentStatusUpdate = z.object({
  body: z.object({
    paymentStatus: z.enum(["pending", "paid", "failed"], {
      required_error: "Payment status is required",
    }),
  }),
});

// order status update
const orderStatusUpdateSchema = z.object({
  body: z.object({
    orderStatus: z.enum(
      ["pending", "processing", "shipped", "delivered", "cancelled"],
      {
        required_error: "Order status is required",
      }
    ),
  }),
});

export const OrderValidationsSchema = {
  createOrder,
  orderPaymentStatusUpdate,
  orderStatusUpdateSchema,
};
