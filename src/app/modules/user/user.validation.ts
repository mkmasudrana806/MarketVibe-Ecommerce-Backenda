import z from "zod";

// create user validations schema
const createUserValidationsSchema = z.object({
  body: z.object({
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
  }),
});

// update user validations schema
const updateUserValidationsSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .optional(),
    age: z
      .number({
        invalid_type_error: "Age should be a number",
        required_error: "Age is required",
      })
      .optional(),
    contact: z
      .string({
        invalid_type_error: "Contact should be a string",
        required_error: "Contact number is required",
      })
      .optional(),
    address: z
      .string({
        invalid_type_error: "Address should be a string",
        required_error: "Address is required",
      })
      .optional(),
  }),
});

// change user status schema
const changeUserStatusSchema = z.object({
  body: z.object({
    status: z.enum(["active", "blocked"], {
      required_error: "User status is required",
    }),
  }),
});

export const UserValidations = {
  createUserValidationsSchema,
  updateUserValidationsSchema,
  changeUserStatusSchema,
};
