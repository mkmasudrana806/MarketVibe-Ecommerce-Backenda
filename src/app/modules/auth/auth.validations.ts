import z from "zod";

// login user schema
const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(4, "Password must be at least 4 characters"),
  }),
});

// change user password schema
const changeUserPasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Old password is required",
    }),
    newPassword: z
      .string({
        required_error: "New password is required",
      })
      .min(4, "Password must be at least 4 characters"),
  }),
});

// forgot password schema
const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),
  }),
});

// reset password schema
const resetPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),
    newPassword: z
      .string({
        required_error: "New password is required",
      })
      .min(4, "Password must be at least 4 characters"),
  }),
});

// refresh token schema
const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required",
      invalid_type_error: "Refresh token must be string",
    }),
  }),
});

export const AuthValidations = {
  loginUserSchema,
  changeUserPasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
};
