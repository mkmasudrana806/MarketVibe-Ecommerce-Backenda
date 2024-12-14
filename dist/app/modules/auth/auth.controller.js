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
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
// ---------------------- Login an user -----------------------
const loginUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInfo = req.body;
    const { accessToken, refreshToken } = yield auth_service_1.AuthServices.loginUserIntoDB(loginInfo);
    // set refresh token to cookie
    res.cookie("refreshToken", refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User is logged in successfully",
        data: { accessToken },
    });
}));
// ---------------------- Change user password -----------------------
const changeUserPassword = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const payload = req.body;
    const result = yield auth_service_1.AuthServices.changeUserPassword(user, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password change is successfull",
        data: result,
    });
}));
// ---------------------- forgot password -----------------------
const forgotPassword = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield auth_service_1.AuthServices.forgotPassword((_a = req.body) === null || _a === void 0 ? void 0 : _a.email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Reset password link is sent to your email address at ${(_b = req.body) === null || _b === void 0 ? void 0 : _b.email}`,
        data: result,
    });
}));
// ---------------------- reset password -----------------------
const resetPassword = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    const token = req.headers.authorization;
    const result = yield auth_service_1.AuthServices.resetPasswordIntoDB(email, newPassword, token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Your password is reset successfull",
        data: result,
    });
}));
// ---------------------- refresh token generate -----------------------
const refreshTokenSetup = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const { accessToken } = yield auth_service_1.AuthServices.refreshTokenSetup(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Access token generated successfully",
        data: { accessToken },
    });
}));
exports.AuthController = {
    loginUser,
    changeUserPassword,
    forgotPassword,
    resetPassword,
    refreshTokenSetup,
};
