import { z } from "zod";

 

// update payment status
const updatePaymentStatusSchema = z.object({
  body: z.object({
    status: z.enum(["completed"]),
  }),
});

export const PaymentValidations = {
 
  updatePaymentStatusSchema,
};
