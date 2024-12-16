import httpStatus from "http-status";
import { TReview } from "./review.interface";
import { Review } from "./review.model";
import makeAllowedFieldData from "../../utils/allowedFieldUpdatedData";
import AppError from "../../utils/AppError";
import { Order } from "../order/order.model";
import QueryBuilder from "../../queryBuilder/queryBuilder";
import { allowedFieldsToUpdate } from "./review.constant";
import { JwtPayload } from "jsonwebtoken";

/**
 *  -------------- create a review into db --------------
 * @param userId user id
 * @param payload review payload
 * @validations check user belong to order with that product and review not exists
 * @returns new review data
 */
const createAReviewIntoDB = async (userId: string, payload: TReview) => {
  const newReview: Record<string, unknown> = { ...payload };
  newReview.user = userId;

  // Check if the user belongs to an order with that product
  let isUserBelongsToOrder = await Order.findOne({
    user: userId,
    vendor: payload.vendor,
    items: {
      $elemMatch: {
        productId: payload.product,
      },
    },
  });

  if (!isUserBelongsToOrder) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "You are not belong to this product!, purchase fist!"
    );
  }

  // check if the user already had given review
  const isReviewExists = await Review.findOne({
    user: userId,
    vendor: payload.vendor,
    product: payload.product,
  });
  if (isReviewExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Review already exists!");
  }

  const result = await Review.create(newReview);
  return result;
};

/**
 * -------------- get user all reviews --------------
 * @param userId login user id
 * @param query req.query object
 * @returns all review belong to the user
 */
const getUserReviewsFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const reviewQuery = new QueryBuilder(
    Review.find({ user: userId }).populate("vendor"),
    query
  )
    .filter()
    .fieldsLimiting()
    .paginate()
    .sort();

  const result = await reviewQuery.modelQuery;
  const meta = await reviewQuery.countTotal();
  return { result, meta };
};

/** -------------- get vendor all reviews --------------
 *
 * @param userId logged in vendor id
 * @param query req.query object
 * @returns all review belong to that vendor
 */
const getVendorReviewsFromDB = async (
  vendorId: string,
  query: Record<string, unknown>
) => {
  const reviewQuery = new QueryBuilder(
    Review.find({ vendor: vendorId })
      .populate({
        path: "product",
        select: "_id name",
      })
      .populate({
        path: "user",
        select: "_id name email",
      }),
    query
  )
    .filter()
    .fieldsLimiting()
    .paginate()
    .sort();

  const result = await reviewQuery.modelQuery;
  const meta = await reviewQuery.countTotal();
  return { result, meta };
};

/**
 * -------------- delete a review --------------
 *
 * @param userData logged in user data
 * @param reviewId review id to be deleted
 * @validations if role is user then delete based on userid and reviewId
 * else delete as admin
 * @returns delete review data
 */
const deleteAReviewIntoDB = async (userData: JwtPayload, reviewId: string) => {
  // if role is user, then delete this review based on userId and reviewId
  let result = null;
  if (userData.role === "user") {
    result = await Review.findOneAndDelete({
      _id: reviewId,
      user: userData.userId,
    });
    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You are not belong to this review or review doesn't exists!"
      );
    }
    // if user.role is not "user", means admin try to delete this review
  } else {
    result = await Review.findOneAndDelete(
      {
        _id: reviewId,
      },
      { new: true }
    );
  }
  return result;
};

/**
 *  -------------- update a review --------------
 *
 * @param userId login user id
 * @param reviewId review id to be updated
 * @param payload updated review payload
 * @returns updated review data
 */
const updateAReviewIntoDB = async (
  userId: string,
  reviewId: string,
  payload: TReview
) => {
  const allowedUpdatedData = makeAllowedFieldData<TReview>(
    allowedFieldsToUpdate,
    payload
  );

  const result = await Review.findOneAndUpdate(
    { _id: reviewId, user: userId },
    allowedUpdatedData,
    {
      runValidators: true,
      new: true,
    }
  );
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are not belong to the review or review doen't exist!"
    );
  }

  return result;
};

export const ReviewProducts = {
  createAReviewIntoDB,
  getUserReviewsFromDB,
  getVendorReviewsFromDB,
  deleteAReviewIntoDB,
  updateAReviewIntoDB,
};
