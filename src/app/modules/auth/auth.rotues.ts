import express from "express";
import validateRequestData from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validations";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
const router = express.Router();

// login an user
router.post(
  "/login",
  validateRequestData(AuthValidations.loginUserSchema),
  AuthController.loginUser
);

// change user password
router.post(
  "/change-password",
  auth("user", "admin"),
  validateRequestData(AuthValidations.changeUserPasswordSchema),
  AuthController.changeUserPassword
);

// forgot password
router.post(
  "/forgot-password",
  validateRequestData(AuthValidations.forgotPasswordSchema),
  AuthController.forgotPassword
);

// reset password
router.post(
  "/reset-password",
  validateRequestData(AuthValidations.resetPasswordSchema),
  AuthController.resetPassword
);

// refresh token setup
router.post(
  "/refresh-token",
  validateRequestData(AuthValidations.refreshTokenSchema),
  AuthController.refreshTokenSetup
);

export const AuthRoutes = router;
