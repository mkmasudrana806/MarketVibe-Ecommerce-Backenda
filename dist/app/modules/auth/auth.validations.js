"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidations = void 0;
const zod_1 = __importDefault(require("zod"));
// login user schema
const loginUserSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: zod_1.default
            .string({
            required_error: "Email is required",
        })
            .email("Invalid email address"),
        password: zod_1.default
            .string({
            required_error: "Password is required",
        })
            .min(4, "Password must be at least 4 characters"),
    }),
});
// change user password schema
const changeUserPasswordSchema = zod_1.default.object({
    body: zod_1.default.object({
        oldPassword: zod_1.default.string({
            required_error: "Old password is required",
        }),
        newPassword: zod_1.default
            .string({
            required_error: "New password is required",
        })
            .min(4, "Password must be at least 4 characters"),
    }),
});
// forgot password schema
const forgotPasswordSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: zod_1.default
            .string({
            required_error: "Email is required",
        })
            .email("Invalid email address"),
    }),
});
// reset password schema
const resetPasswordSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: zod_1.default
            .string({
            required_error: "Email is required",
        })
            .email("Invalid email address"),
        newPassword: zod_1.default
            .string({
            required_error: "New password is required",
        })
            .min(4, "Password must be at least 4 characters"),
    }),
});
// refresh token schema
const refreshTokenSchema = zod_1.default.object({
    cookies: zod_1.default.object({
        refreshToken: zod_1.default.string({
            required_error: "Refresh token is required",
            invalid_type_error: "Refresh token must be string",
        }),
    }),
});
exports.AuthValidations = {
    loginUserSchema,
    changeUserPasswordSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    refreshTokenSchema,
};
