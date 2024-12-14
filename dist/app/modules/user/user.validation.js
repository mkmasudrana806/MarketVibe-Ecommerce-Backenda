"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = __importDefault(require("zod"));
// create user validations schema
const createUserValidationsSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string({
            required_error: "Name is required",
        }),
        email: zod_1.default
            .string({
            required_error: "Email is required",
        })
            .email("Invalid email address"),
        password: zod_1.default.string().optional(),
        age: zod_1.default.number({
            invalid_type_error: "Age should be a number",
            required_error: "Age is required",
        }),
        contact: zod_1.default.string({
            invalid_type_error: "Contact should be a string",
            required_error: "Contact number is required",
        }),
        address: zod_1.default.string({
            invalid_type_error: "Address should be a string",
            required_error: "Address is required",
        }),
    }),
});
// update user validations schema
const updateUserValidationsSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default
            .string({
            required_error: "Name is required",
        })
            .optional(),
        age: zod_1.default
            .number({
            invalid_type_error: "Age should be a number",
            required_error: "Age is required",
        })
            .optional(),
        contact: zod_1.default
            .string({
            invalid_type_error: "Contact should be a string",
            required_error: "Contact number is required",
        })
            .optional(),
        address: zod_1.default
            .string({
            invalid_type_error: "Address should be a string",
            required_error: "Address is required",
        })
            .optional(),
    }),
});
// change user status schema
const changeUserStatusSchema = zod_1.default.object({
    body: zod_1.default.object({
        status: zod_1.default.enum(["active", "blocked"], {
            required_error: "User status is required",
        }),
    }),
});
exports.UserValidations = {
    createUserValidationsSchema,
    updateUserValidationsSchema,
    changeUserStatusSchema,
};
