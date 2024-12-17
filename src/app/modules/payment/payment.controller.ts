import httpStatus from "http-status";
import asyncHanlder from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";

// ------------- make payment ----------------
const makePayment = asyncHanlder(async (req, res) => {
  const { tnxId, userId, orderId, status } = req?.query;

  // take action based on status of the payment
  await PaymentServices.makePaymentIntoDB(
    tnxId as string,
    userId as string,
    orderId as string,
    status as string
  );

  res.send(`<h1>Payment ${status}</h1>`);
});

// get all payments history
const allPaymentHistory = asyncHanlder(async (req, res) => {
  const { result, meta } = await PaymentServices.allPaymentsHistoryFromDB(
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "payments history retrieved successfull",
    data: result,
    meta: meta,
  });
});

// get user payments history
const userPaymentHistory = asyncHanlder(async (req, res) => {
  const { result, meta } = await PaymentServices.userPaymentsHistoryFromDB(
    req.user.userId,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User payments history retrieved successfull",
    data: result,
    meta: meta,
  });
});

// get vendor payments history
const vendorPaymentHistory = asyncHanlder(async (req, res) => {
  const { result, meta } = await PaymentServices.vendorPaymentsHistoryFromDB(
    req.user.userId,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vendor payments history retrieved successfull",
    data: result,
    meta: meta,
  });
});

export const PaymentControllers = {
  makePayment,
  allPaymentHistory,
  userPaymentHistory,
  vendorPaymentHistory,
};
