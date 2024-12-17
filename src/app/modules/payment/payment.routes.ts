import express from "express";
import { PaymentControllers } from "./payment.controller";
import auth from "../../middlewares/auth";
const router = express.Router();

// make payment
router.post("/make-payment", PaymentControllers.makePayment);

// get all payments history
router.get("/", auth("admin"), PaymentControllers.allPaymentHistory);

// get user payments history
router.get(
  "/user-payments",
  auth("user"),
  PaymentControllers.userPaymentHistory
);

// get user payments history
router.get(
  "/vendor-payments",
  auth("vendor"),
  PaymentControllers.vendorPaymentHistory
);

export const PaymentRoutes = router;
