/** @format */

import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email({
      message:
        "Please enter a valid email address (e.g., example@domain.com) to log in!",
    })
    .transform((val) => val.toLowerCase()), // Convert email to lowercase
  password: z.string().min(1, {
    message:
      "Oops! Your password is required to log in. Please provide it to continue.",
  }),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Please provide your name to get started!" }),
  email: z
    .string()
    .email({
      message:
        "Please enter a valid email address (e.g., example@domain.com)!",
    })
    .transform((val) => val.toLowerCase()),
  password: z.string().min(6, {
    message:
      "Your password should be at least 6 characters long for better security.",
  }),
});
