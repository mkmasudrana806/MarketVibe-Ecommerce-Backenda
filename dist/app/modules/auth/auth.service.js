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
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const user_model_1 = require("../user/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
/**
 * -------------------- Login user into DB ---------------------
 * @param email email address
 * @param password password
 * @validations check if the user exists, not deleted or blocked and password is correct
 * @returns return access token
 */
const loginUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({
        email: payload === null || payload === void 0 ? void 0 : payload.email,
        isDeleted: false,
        status: "active",
    });
    // check if user exists, not deleted or blocked
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    // check if the password is correct
    if (!(yield user_model_1.User.isPasswordMatch(payload === null || payload === void 0 ? void 0 : payload.password, user.password))) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password is incorrect!");
    }
    // make access token and refresh token
    const jwtPayload = {
        name: user.name,
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: config_1.default.jwt_access_expires_in,
    });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_refresh_secret, {
        expiresIn: config_1.default.jwt_refresh_expires_in,
    });
    return { accessToken, refreshToken };
});
/**
 * -------------------- Change user password into DB ---------------------
 * @param userData jwt user data
 * @param payload old and new password payload
 * @validations check if the user exists, not deleted or blocked and password is correct.
 * @returns return updated user data
 */
const changeUserPassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({
        email: userData === null || userData === void 0 ? void 0 : userData.email,
        role: userData === null || userData === void 0 ? void 0 : userData.role,
    });
    // check if user exists, not deleted or blocked
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is already deleted!");
    }
    if (user.status === "blocked") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is already blocked!");
    }
    // check if the password is correct
    if (!(yield user_model_1.User.isPasswordMatch(payload === null || payload === void 0 ? void 0 : payload.oldPassword, user.password))) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password is incorrect!");
    }
    // hash the new password
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    // update the password
    const result = yield user_model_1.User.findOneAndUpdate({
        email: userData === null || userData === void 0 ? void 0 : userData.email,
        role: userData === null || userData === void 0 ? void 0 : userData.role,
    }, {
        password: hashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    }, { new: true });
    return result;
});
/**
 * --------------------- forgot password ---------------------
 * @param email email address
 * @validations check if the user exists, not deleted or blocked
 * @features send a reset link to the user email address using nodemailer
 */
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    // check if user exists, not deleted or blocked
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is already deleted!");
    }
    if (user.status === "blocked") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is already blocked!");
    }
    // jwt payload and create an access token
    const jwtPayload = {
        name: user.name,
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const resetToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: "10m",
    });
    // send reset link to email address
    const resetUILink = `${config_1.default.reset_password_ui_link}?email=${email}&token=${resetToken}`;
    const result = yield (0, sendEmail_1.default)(user === null || user === void 0 ? void 0 : user.email, `<p>${resetUILink}</p>`);
    return result;
});
/**
 * --------------------- reset password into db ---------------------
 * @param email email address
 * @param newPassword new password from client
 * @param token token from mail inbox
 * @returns return updated user data
 */
const resetPasswordIntoDB = (email, newPassword, token) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the token is given
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access!");
    }
    // decoded the token
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    if (!decoded || decoded.email !== email) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access!");
    }
    const user = yield user_model_1.User.findOne({ email });
    // check if user exists, not deleted or blocked
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is already deleted!");
    }
    if (user.status === "blocked") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is already blocked!");
    }
    // hash the new password
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield user_model_1.User.findOneAndUpdate({ email }, {
        password: hashedPassword,
        passwordChangedAt: new Date(),
        needsPasswordChange: false,
    }, { new: true });
    return result;
});
/**
 * --------------------- refresh token setup -------------------------
 * @param token refresh token
 * @validations check if the refresh token and user valid. jwt is not issued before password change timestamp
 * @returns return access token
 */
const refreshTokenSetup = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the token is given
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access!");
    }
    // decoded the token
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    if (!decoded) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access!");
    }
    const user = yield user_model_1.User.findOne({ email: decoded.email });
    // check if user exists, not deleted or blocked
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User is not found!");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is already deleted!");
    }
    if (user.status === "blocked") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is already blocked!");
    }
    // check if jwt is not issued before password change
    if (user.passwordChangedAt &&
        user_model_1.User.isJWTIssuedBeforePasswordChange(user.passwordChangedAt, decoded.iat)) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized access!, your refresh token is invalid!");
    }
    // create an access token
    const jwtPayload = {
        name: user.name,
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: config_1.default.jwt_access_expires_in,
    });
    return { accessToken };
});
exports.AuthServices = {
    loginUserIntoDB,
    changeUserPassword,
    forgotPassword,
    resetPasswordIntoDB,
    refreshTokenSetup,
};
