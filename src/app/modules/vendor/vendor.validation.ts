import { z } from "zod";

//  user validations schema
const userValidationsSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email address"),
  password: z.string().optional(),
  age: z.number({
    invalid_type_error: "Age should be a number",
    required_error: "Age is required",
  }),
  contact: z.string({
    invalid_type_error: "Contact should be a string",
    required_error: "Contact number is required",
  }),
  address: z.string({
    invalid_type_error: "Address should be a string",
    required_error: "Address is required",
  }),
});

// social link schema
const socialLinkSchema = z.object({
  socialName: z.string({ required_error: "Social Name is required" }),
  socialLink: z.string({ required_error: "Social link is required" }),
});

// create vendor validation schema
const createVendor = z.object({
  body: z.object({
    user: userValidationsSchema,
    shopName: z.string().min(1, "Shop name is required"),
    description: z.string().min(1, "Description is required"),
    address: z.string().min(1, "Address is required"),
    contact: z.string().min(1, "Contact is required"),
    socialLinks: z.array(socialLinkSchema).optional(),
  }),
});

// update vendor validation schema
const updateVendor = z.object({
  body: z.object({
    shopName: z.string().min(1, "Shop name is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    address: z.string().min(1, "Address is required").optional(),
    contact: z.string().min(1, "Contact is required").optional(),
  }),
});

// change vendor status schema
const changeVendorStatusSchema = z.object({
  body: z.object({
    status: z.enum(["active", "blocked"], {
      required_error: "User status is required",
    }),
  }),
});

export const VendorValidationsSchema = {
  createVendor,
  updateVendor,
  changeVendorStatusSchema,
};
