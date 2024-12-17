import { Order } from "./order.model";
import AppError from "../../utils/AppError";
import httpStatus from "http-status";
import TOrder from "./order.interface";
import QueryBuilder from "../../queryBuilder/queryBuilder";
import { orderStatusSequence, searchableFields } from "./order.constant";
import { TPayment } from "../payment/payment.interface";
import { initiatePayment } from "../payment/payment.utils";
import { JwtPayload } from "jsonwebtoken";
import { CouponService } from "../coupon/coupon.service";

/**
 * create a new order
 * @param payload order data
 * @returns newly created order
 */
const createOrderInDB = async (user: JwtPayload, payload: TOrder) => {
  // if coupon code is applied, again atomic check that coupon is valid
  if (payload.couponCode) {
    const isCouponValid = await CouponService.validateCouponIntoDB(
      payload.couponCode,
      payload.totalAmount,
      payload.vendor.toString()
    );

    if (!isCouponValid.isValid) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Coupon maybe invalid or expired or usage limit exceeded!"
      );
    }
  }
  // set order user
  payload.user = user.userId;

  // save order data to database
  const order = await Order.create(payload);

  // ------------- payment data
  const tnxId = `tnx-${Date.now()}`;
  const paymentData: Partial<TPayment> = {
    email: user.email,
    amount: payload.totalAmount,
    transactionId: tnxId,
  };

  const successUrl = `http://localhost:5000/api/payments/make-payment?tnxId=${tnxId}&userId=${user.userId}&orderId=${order._id}&status=success`;
  const failedUrl = `http://localhost:5000/api/payments/make-payment?tnxId=${tnxId}&userId=${user.userId}&orderId=${order._id}&status=failed`;

  //  initiate amarPay session and return session url
  const session = await initiatePayment(paymentData, successUrl, failedUrl);
  return session;
};

/**
 * get all orders
 * @returns list of all orders
 */
const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(Order.find(), query)
    .filter()
    .search(searchableFields)
    .fieldsLimiting()
    .paginate()
    .sort();

  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();
  return { result, meta };
};

/**
 * get all orders for a user
 * @param userId user id
 * @returns list of orders for the user
 */
const getUserOrdersFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const orderQuery = new QueryBuilder(Order.find({ user: userId }), query)
    .filter()
    .search(searchableFields)
    .fieldsLimiting()
    .paginate()
    .sort();

  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();
  return { result, meta };
};

/**
 * get all orders for a vendor
 * @param userId user id
 * @returns list of orders for the user
 */
const getVendorOrdersFromDB = async (
  vendorId: string,
  query: Record<string, unknown>
) => {
  const orderQuery = new QueryBuilder(Order.find({ vendor: vendorId }), query)
    .filter()
    .search(searchableFields)
    .fieldsLimiting()
    .paginate()
    .sort();

  const result = await orderQuery.modelQuery;
  const meta = await orderQuery.countTotal();
  return { result, meta };
};

/**
 * -------------------- update order payment status ----------------------
 * @param orderId order id
 * @param payload  payment status
 * @returns return updated order data
 */
const updateOrderPaymentStatusIntoDB = async (
  vendorId: string,
  orderId: string,
  payload: { paymentStatus: string }
) => {
  const result = await Order.findOneAndUpdate(
    { _id: orderId, vendor: vendorId, paymentStatus: "pending" },
    payload,
    {
      new: true,
    }
  );

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Already payment status paid or failed`
    );
  }
  return result;
};

/**
 * -------------------- update order status ----------------------
 * @param orderId order id
 * @param payload  order status
 * @returns return updated order data
 */
const updateOrderStatusIntoDB = async (
  vendorId: string,
  orderId: string,
  payload: { orderStatus: string }
) => {
  const order = await Order.findOne({ _id: orderId, vendor: vendorId });
  if (!order) {
    throw new Error("Order not found");
  }

  const currentStatus = order.orderStatus;
  // throw error if current status is not pending, but trying to cancelled
  if (payload.orderStatus === "cancelled") {
    if (currentStatus !== "pending") {
      throw new Error(
        `Cannot cancel the order. Only orders with status 'pending' can be cancelled.`
      );
    }
  } else {
    // check if status update is valid in the sequence
    const currentIndex = orderStatusSequence.indexOf(currentStatus);
    const newIndex = orderStatusSequence.indexOf(payload.orderStatus);
    if (newIndex <= currentIndex) {
      throw new Error(
        `Cannot update order status to '${payload.orderStatus}'. Current status is '${currentStatus}'`
      );
    }
  }
  const result = await Order.findOneAndUpdate(
    { _id: orderId, vendor: vendorId },
    payload,
    {
      new: true,
      runvalidators: true,
    }
  );
  return result;
};

export const OrderServices = {
  createOrderInDB,
  getAllOrdersFromDB,
  getUserOrdersFromDB,
  getVendorOrdersFromDB,
  updateOrderPaymentStatusIntoDB,
  updateOrderStatusIntoDB,
};
