import httpStatus from "http-status";
import bcrypt from "bcrypt";
import AppError from "../../utils/AppError";
import { User } from "../user/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { TLoginUser } from "./auth.interface";
import sendEmail from "../../utils/sendEmail";

/**
 * -------------------- Login user into DB ---------------------
 * @param email email address
 * @param password password
 * @validations check if the user exists, not deleted or blocked and password is correct
 * @returns return access token
 */
const loginUserIntoDB = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload?.email });
  // check if user exists, not deleted or blocked
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
  }
  if (user.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is already blocked!");
  }

  // check if the password is correct
  if (!(await User.isPasswordMatch(payload?.password, user.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is incorrect!");
  }

  // make access token and refresh token
  const jwtPayload = { email: user.email, role: user.role };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in,
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    {
      expiresIn: config.jwt_refresh_expires_in,
    }
  );

  return { accessToken, refreshToken };
};

/**
 * -------------------- Change user password into DB ---------------------
 * @param userData jwt user data
 * @param payload old and new password payload
 * @validations check if the user exists, not deleted or blocked and password is correct.
 * @returns return updated user data
 */
const changeUserPassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await User.findOne({
    email: userData?.email,
    role: userData?.role,
  });
  // check if user exists, not deleted or blocked
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
  }
  if (user.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is already blocked!");
  }

  // check if the password is correct
  if (!(await User.isPasswordMatch(payload?.oldPassword, user.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is incorrect!");
  }

  // hash the new password
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  // update the password
  const result = await User.findOneAndUpdate(
    {
      email: userData?.email,
      role: userData?.role,
    },
    {
      password: hashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true }
  );

  return result;
};

/**
 * --------------------- forgot password ---------------------
 * @param email email address
 * @validations check if the user exists, not deleted or blocked
 * @features send a reset link to the user email address using nodemailer
 */
const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  // check if user exists, not deleted or blocked
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
  }
  if (user.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is already blocked!");
  }

  // jwt payload and create an access token
  const jwtPayload = { email: user?.email, role: user?.role };
  const resetToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "10m",
  });

  // send reset link to email address
  const resetUILink = `${config.reset_password_ui_link}?email=${email}&token=${resetToken}`;
  const result = await sendEmail(user?.email, `<p>${resetUILink}</p>`);
  return result;
};

/**
 * --------------------- reset password into db ---------------------
 * @param email email address
 * @param newPassword new password from client
 * @param token token from mail inbox
 * @returns return updated user data
 */
const resetPasswordIntoDB = async (
  email: string,
  newPassword: string,
  token: string
) => {
  // check if the token is given
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access!");
  }

  // decoded the token
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;
  if (!decoded || decoded.email !== email) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access!");
  }

  const user = await User.findOne({ email });
  // check if user exists, not deleted or blocked
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
  }
  if (user.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is already blocked!");
  }

  // hash the new password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await User.findOneAndUpdate(
    { email },
    {
      password: hashedPassword,
      passwordChangedAt: new Date(),
      needsPasswordChange: false,
    },
    { new: true }
  );

  return result;
};

/**
 * --------------------- refresh token setup -------------------------
 * @param token refresh token
 * @validations check if the refresh token and user valid. jwt is not issued before password change timestamp
 * @returns return access token
 */
const refreshTokenSetup = async (token: string) => {
  // check if the token is given
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access!");
  }

  // decoded the token
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;
  if (!decoded) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access!");
  }

  const user = await User.findOne({ email: decoded.email });
  // check if user exists, not deleted or blocked
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
  }
  if (user.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User is already blocked!");
  }

  // check if jwt is not issued before password change
  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChange(
      user.passwordChangedAt,
      decoded.iat as number
    )
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized access!, your refresh token is invalid!"
    );
  }

  // create an access token
  const jwtPayload = { email: user.email, role: user.role };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in,
  });

  return { accessToken };
};

export const AuthServices = {
  loginUserIntoDB,
  changeUserPassword,
  forgotPassword,
  resetPasswordIntoDB,
  refreshTokenSetup,
};
