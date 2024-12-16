"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidationsSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
// create order validation schema
const createOrder = zod_1.z.object({
    body: zod_1.z.object({
        vendor: zod_1.z.string().refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
            message: "Vendor is not valid",
        }),
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string().refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
                message: "Invalid product id format",
            }),
            quantity: zod_1.z.number().int().positive("Quantity must be positive"),
            price: zod_1.z.number().nonnegative("Price must be a positive number"),
        })),
        shippingAddress: zod_1.z.string({
            required_error: "Shipping address is required",
            invalid_type_error: "Shipping address must be a valid string",
        }),
    }),
});
// order payment status update
const orderPaymentStatusUpdate = zod_1.z.object({
    body: zod_1.z.object({
        paymentStatus: zod_1.z.enum(["pending", "paid", "failed"], {
            required_error: "Payment status is required",
        }),
    }),
});
// order status update
const orderStatusUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderStatus: zod_1.z.enum(["pending", "processing", "shipped", "delivered", "cancelled"], {
            required_error: "Order status is required",
        }),
    }),
});
exports.OrderValidationsSchema = {
    createOrder,
    orderPaymentStatusUpdate,
    orderStatusUpdateSchema,
};
