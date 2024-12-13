import httpStatus from "http-status";
import asyncHanlder from "../../utils/asyncHandler";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

// ---------------------- Login an user -----------------------
const loginUser = asyncHanlder(async (req, res) => {
  const loginInfo = req.body;
  const { accessToken, refreshToken } = await AuthServices.loginUserIntoDB(
    loginInfo
  );

  // set refresh token to cookie
  res.cookie("refreshToken", refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in successfully",
    data: { accessToken },
  });
});

// ---------------------- Change user password -----------------------
const changeUserPassword = asyncHanlder(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const result = await AuthServices.changeUserPassword(user, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password change is successfull",
    data: result,
  });
});

// ---------------------- forgot password -----------------------
const forgotPassword = asyncHanlder(async (req, res) => {
  const result = await AuthServices.forgotPassword(req.body?.email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Reset password link is sent to your email address at ${req.body?.email}`,
    data: result,
  });
});

// ---------------------- reset password -----------------------
const resetPassword = asyncHanlder(async (req, res) => {
  const { email, newPassword } = req.body;
  const token = req.headers.authorization as string;
  const result = await AuthServices.resetPasswordIntoDB(
    email,
    newPassword,
    token
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your password is reset successfull",
    data: result,
  });
});

// ---------------------- refresh token generate -----------------------
const refreshTokenSetup = asyncHanlder(async (req, res) => {
  const { refreshToken } = req.cookies;
  const { accessToken } = await AuthServices.refreshTokenSetup(refreshToken);
   
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token generated successfully",
    data: { accessToken },
  });
});

export const AuthController = {
  loginUser,
  changeUserPassword,
  forgotPassword,
  resetPassword,
  refreshTokenSetup,
};
