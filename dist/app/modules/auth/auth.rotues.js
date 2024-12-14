"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validations_1 = require("./auth.validations");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// login an user
router.post("/login", (0, validateRequest_1.default)(auth_validations_1.AuthValidations.loginUserSchema), auth_controller_1.AuthController.loginUser);
// change user password
router.post("/change-password", (0, auth_1.default)("user", "admin"), (0, validateRequest_1.default)(auth_validations_1.AuthValidations.changeUserPasswordSchema), auth_controller_1.AuthController.changeUserPassword);
// forgot password
router.post("/forgot-password", (0, validateRequest_1.default)(auth_validations_1.AuthValidations.forgotPasswordSchema), auth_controller_1.AuthController.forgotPassword);
// reset password
router.post("/reset-password", (0, validateRequest_1.default)(auth_validations_1.AuthValidations.resetPasswordSchema), auth_controller_1.AuthController.resetPassword);
// refresh token setup
router.post("/refresh-token", (0, validateRequest_1.default)(auth_validations_1.AuthValidations.refreshTokenSchema), auth_controller_1.AuthController.refreshTokenSetup);
exports.AuthRoutes = router;
