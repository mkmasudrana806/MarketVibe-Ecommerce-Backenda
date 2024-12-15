"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorValidationsSchema = void 0;
const zod_1 = require("zod");
//  user validations schema
const userValidationsSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Name is required",
    }),
    email: zod_1.z
        .string({
        required_error: "Email is required",
    })
        .email("Invalid email address"),
    password: zod_1.z.string().optional(),
    age: zod_1.z.number({
        invalid_type_error: "Age should be a number",
        required_error: "Age is required",
    }),
    contact: zod_1.z.string({
        invalid_type_error: "Contact should be a string",
        required_error: "Contact number is required",
    }),
    address: zod_1.z.string({
        invalid_type_error: "Address should be a string",
        required_error: "Address is required",
    }),
});
// social link schema
const socialLinkSchema = zod_1.z.object({
    socialName: zod_1.z.string({ required_error: "Social Name is required" }),
    socialLink: zod_1.z.string({ required_error: "Social link is required" }),
});
// create vendor validation schema
const createVendor = zod_1.z.object({
    body: zod_1.z.object({
        user: userValidationsSchema,
        shopName: zod_1.z.string().min(1, "Shop name is required"),
        description: zod_1.z.string().min(1, "Description is required"),
        address: zod_1.z.string().min(1, "Address is required"),
        contact: zod_1.z.string().min(1, "Contact is required"),
        socialLinks: zod_1.z.array(socialLinkSchema).optional(),
    }),
});
// update vendor validation schema
const updateVendor = zod_1.z.object({
    body: zod_1.z.object({
        shopName: zod_1.z.string().min(1, "Shop name is required").optional(),
        description: zod_1.z.string().min(1, "Description is required").optional(),
        address: zod_1.z.string().min(1, "Address is required").optional(),
        contact: zod_1.z.string().min(1, "Contact is required").optional(),
    }),
});
// change vendor status schema
const changeVendorStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["active", "blocked"], {
            required_error: "User status is required",
        }),
    }),
});
exports.VendorValidationsSchema = {
    createVendor,
    updateVendor,
    changeVendorStatusSchema,
};
