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
exports.ReviewControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const review_service_1 = require("./review.service");
// ------------------- create a review -------------------
const createAReview = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.ReviewProducts.createAReviewIntoDB(req.user.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Review posted is successfull",
        data: result,
    });
}));
// --------------- get user all reviews -------------------
const getUserReviews = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, meta } = yield review_service_1.ReviewProducts.getUserReviewsFromDB(req.user.userId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All Reviews retrieved successfull",
        data: result,
        meta: meta,
    });
}));
// --------------- get vendor all reviews -------------------
const getVendorReviews = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, meta } = yield review_service_1.ReviewProducts.getVendorReviewsFromDB(req.user.userId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All Reviews retrieved successfull",
        data: result,
        meta: meta,
    });
}));
// ------------------- delete a review -------------------
const deleteAReview = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.ReviewProducts.deleteAReviewIntoDB(req.user, req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Review deleted successfull",
        data: result,
    });
}));
// ------------------- update a review -------------------
const updateAReview = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const reviewId = (_b = req.params) === null || _b === void 0 ? void 0 : _b.id;
    const result = yield review_service_1.ReviewProducts.updateAReviewIntoDB(userId, reviewId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Review updated successfull",
        data: result,
    });
}));
exports.ReviewControllers = {
    createAReview,
    getUserReviews,
    getVendorReviews,
    deleteAReview,
    updateAReview,
};
