"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidations = void 0;
const zod_1 = require("zod");
// update payment status
const updatePaymentStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["completed"]),
    }),
});
exports.PaymentValidations = {
    updatePaymentStatusSchema,
};
