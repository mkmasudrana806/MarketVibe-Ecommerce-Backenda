import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import asyncHanlder from "../../utils/asyncHandler";
import { ReviewProducts } from "./review.service";

// ------------------- create a review -------------------
const createAReview = asyncHanlder(async (req, res) => {
  const result = await ReviewProducts.createAReviewIntoDB(
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review posted is successfull",
    data: result,
  });
});

// --------------- get user all reviews -------------------
const getUserReviews = asyncHanlder(async (req, res) => {
  const { result, meta } = await ReviewProducts.getUserReviewsFromDB(
    req.user.userId,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Reviews retrieved successfull",
    data: result,
    meta: meta,
  });
});

// --------------- get vendor all reviews -------------------
const getVendorReviews = asyncHanlder(async (req, res) => {
  const { result, meta } = await ReviewProducts.getVendorReviewsFromDB(
    req.user.userId,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Reviews retrieved successfull",
    data: result,
    meta: meta,
  });
});

// ------------------- delete a review -------------------
const deleteAReview = asyncHanlder(async (req, res) => {
  const result = await ReviewProducts.deleteAReviewIntoDB(
    req.user,
    req.params.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfull",
    data: result,
  });
});

// ------------------- update a review -------------------
const updateAReview = asyncHanlder(async (req, res) => {
  const userId = req.user?.userId;
  const reviewId = req.params?.id;
  const result = await ReviewProducts.updateAReviewIntoDB(
    userId,
    reviewId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review updated successfull",
    data: result,
  });
});

export const ReviewControllers = {
  createAReview,
  getUserReviews,
  getVendorReviews,
  deleteAReview,
  updateAReview,
};
