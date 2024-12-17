import { Payment } from "./payment.model";
import { JwtPayload } from "jsonwebtoken";
import { verifyPayment } from "./payment.utils";
import mongoose from "mongoose";
import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import { Order } from "../order/order.model";
import { TPayment } from "./payment.interface";
import QueryBuilder from "../../queryBuilder/queryBuilder";
import { searchableFields } from "./payment.constant";
import { Coupon } from "../coupon/coupon.model";

/**
 * --------------- make payment ---------------
 *
 * @param tnxId transaction id of the session
 * @param userId id of the user who owns the transaction
 * @param orderId order id of the order that owns the transaction
 * @param status  status of the transaction
 * @returns nothing
 */
const makePaymentIntoDB = async (
  tnxId: string,
  userId: string,
  orderId: string,
  status: string
) => {
  // check if the user belong to the order
  const isUserBelong = await Order.findOne({ _id: orderId, user: userId });
  if (!isUserBelong) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are not belong to that order"
    );
  }

  // if payment failed, then update paymentStatus to 'failed' in order collection
  if (status === "failed") {
    await Order.findOneAndUpdate(
      { _id: orderId, user: userId },
      { paymentStatus: "failed" }
    );
    return;
  }
  // if payment success, then take below action
  // verify payment in amarpay database
  const isPaidtoAmarpay = await verifyPayment(tnxId);

  // if paid and pay_status 'Successful' then update paymentStatus to 'paid'
  // and create a record into 'Payment' collection
  if (isPaidtoAmarpay && isPaidtoAmarpay.pay_status === "Successful") {
    const session = await mongoose.startSession();
    try {
      // start transaction
      session.startTransaction();

      // update paymentStatus in Order
      const updatedOrderData = await Order.findOneAndUpdate(
        { _id: orderId },
        { paymentStatus: "paid" },
        { runValidators: true, session, new: true }
      );
      if (!updatedOrderData) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Faild to update paymentStatus in order"
        );
      }

      // create a record into 'Payment' collection
      const paymentData: Partial<TPayment> = {
        user: userId,
        vendor: updatedOrderData.vendor,
        order: orderId,
        amount: updatedOrderData.totalAmount,
        paymentStatus: "success",
        transactionId: tnxId,
      };
      await Payment.create(paymentData);

      // update coupon usage limit if this order contain any coupon code
      if (updatedOrderData.couponCode) {
        await Coupon.findOneAndUpdate(
          { code: updatedOrderData.couponCode },
          { $inc: { timesUsed: 1 } },
          { session }
        );
      }

      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Faild to make payment"
      );
    }
  }
};

/**
 * --------------- get all payments history ---------------
 *
 * @param query req.query object containing query parameters
 * @returns all payments history
 */
const allPaymentsHistoryFromDB = async (query: Record<string, unknown>) => {
  const paymentQuery = new QueryBuilder(Payment.find(), query)
    .filter()
    .search(searchableFields)
    .fieldsLimiting()
    .paginate()
    .sort();

  const result = await paymentQuery.modelQuery;
  const meta = await paymentQuery.countTotal();
  return { result, meta };
};

// get user payments history
const userPaymentsHistoryFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const paymentQuery = new QueryBuilder(Payment.find({ user: userId }), query)
    .filter()
    .search(searchableFields)
    .fieldsLimiting()
    .paginate()
    .sort();

  const result = await paymentQuery.modelQuery;
  const meta = await paymentQuery.countTotal();
  return { result, meta };
};

// get vendor payments history
const vendorPaymentsHistoryFromDB = async (
  vendorId: string,
  query: Record<string, unknown>
) => {
  const paymentQuery = new QueryBuilder(
    Payment.find({ vendor: vendorId }),
    query
  )
    .filter()
    .search(searchableFields)
    .fieldsLimiting()
    .paginate()
    .sort();

  const result = await paymentQuery.modelQuery;
  const meta = await paymentQuery.countTotal();
  return { result, meta };
};

export const PaymentServices = {
  makePaymentIntoDB,
  allPaymentsHistoryFromDB,
  userPaymentsHistoryFromDB,
  vendorPaymentsHistoryFromDB,
};
