"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewProducts = void 0;
const http_status_1 = __importDefault(require("http-status"));
const review_model_1 = require("./review.model");
const allowedFieldUpdatedData_1 = __importDefault(require("../../utils/allowedFieldUpdatedData"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const order_model_1 = require("../order/order.model");
const queryBuilder_1 = __importDefault(require("../../queryBuilder/queryBuilder"));
const review_constant_1 = require("./review.constant");
/**
 *  -------------- create a review into db --------------
 * @param userId user id
 * @param payload review payload
 * @validations check user belong to order with that product and review not exists
 * @returns new review data
 */
const createAReviewIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newReview = Object.assign({}, payload);
    newReview.user = userId;
    // Check if the user belongs to an order with that product
    let isUserBelongsToOrder = yield order_model_1.Order.findOne({
        user: userId,
        vendor: payload.vendor,
        items: {
            $elemMatch: {
                productId: payload.product,
            },
        },
    });
    if (!isUserBelongsToOrder) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "You are not belong to this product!, purchase fist!");
    }
    // check if the user already had given review
    const isReviewExists = yield review_model_1.Review.findOne({
        user: userId,
        vendor: payload.vendor,
        product: payload.product,
    });
    if (isReviewExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Review already exists!");
    }
    const result = yield review_model_1.Review.create(newReview);
    return result;
});
/**
 * -------------- get user all reviews --------------
 * @param userId login user id
 * @param query req.query object
 * @returns all review belong to the user
 */
const getUserReviewsFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewQuery = new queryBuilder_1.default(review_model_1.Review.find({ user: userId }).populate("vendor"), query)
        .filter()
        .fieldsLimiting()
        .paginate()
        .sort();
    const result = yield reviewQuery.modelQuery;
    const meta = yield reviewQuery.countTotal();
    return { result, meta };
});
/** -------------- get vendor all reviews --------------
 *
 * @param userId logged in vendor id
 * @param query req.query object
 * @returns all review belong to that vendor
 */
const getVendorReviewsFromDB = (vendorId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewQuery = new queryBuilder_1.default(review_model_1.Review.find({ vendor: vendorId })
        .populate({
        path: "product",
        select: "_id name",
    })
        .populate({
        path: "user",
        select: "_id name email",
    }), query)
        .filter()
        .fieldsLimiting()
        .paginate()
        .sort();
    const result = yield reviewQuery.modelQuery;
    const meta = yield reviewQuery.countTotal();
    return { result, meta };
});
/**
 * -------------- delete a review --------------
 *
 * @param userData logged in user data
 * @param reviewId review id to be deleted
 * @validations if role is user then delete based on userid and reviewId
 * else delete as admin
 * @returns delete review data
 */
const deleteAReviewIntoDB = (userData, reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    // if role is user, then delete this review based on userId and reviewId
    let result = null;
    if (userData.role === "user") {
        result = yield review_model_1.Review.findOneAndDelete({
            _id: reviewId,
            user: userData.userId,
        });
        if (!result) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are not belong to this review or review doesn't exists!");
        }
        // if user.role is not "user", means admin try to delete this review
    }
    else {
        result = yield review_model_1.Review.findOneAndDelete({
            _id: reviewId,
        }, { new: true });
    }
    return result;
});
/**
 *  -------------- update a review --------------
 *
 * @param userId login user id
 * @param reviewId review id to be updated
 * @param payload updated review payload
 * @returns updated review data
 */
const updateAReviewIntoDB = (userId, reviewId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const allowedUpdatedData = (0, allowedFieldUpdatedData_1.default)(review_constant_1.allowedFieldsToUpdate, payload);
    const result = yield review_model_1.Review.findOneAndUpdate({ _id: reviewId, user: userId }, allowedUpdatedData, {
        runValidators: true,
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You are not belong to the review or review doen't exist!");
    }
    return result;
});
exports.ReviewProducts = {
    createAReviewIntoDB,
    getUserReviewsFromDB,
    getVendorReviewsFromDB,
    deleteAReviewIntoDB,
    updateAReviewIntoDB,
};
