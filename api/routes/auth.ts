/** @format */

import { Router } from "express";
import apiKeysRoute from "./keys";
import { z } from "zod";
import { prisma } from "../db";
import {
  comparePassword,
  encryptPassword,
  generateToken,
} from "../utils/functions";
import { AvailablePermissions } from "../utils/permissions";

const router = Router();

router.use("/api-keys", apiKeysRoute);

const loginSchema = z.object({
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

router.post("/login", async (req, res, next) => {
  try {
    const { error, success } = loginSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        message: "Validation error",
        validationCapture: error.errors,
      });

      return;
    }

    const data: z.infer<typeof registerSchema> = req.body;

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // If user not found or password is invalid
    if (
      !user ||
      !(await comparePassword(data.password, user.password))
    ) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = generateToken(user.id, [
      AvailablePermissions.CreateApiKey,
      AvailablePermissions.CreateRecipe,
    ]);

    const accessToken = `Bearer ${token}`; // Add any other claims you need here)}`;

    res
      .status(200)
      .json({ message: "user successfully logged in", accessToken });
  } catch (error) {
    next(error);
  }
});

const registerSchema = z.object({
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

router.post("/register", async (req, res, next) => {
  try {
    const { error, success } = registerSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        message: "validation error",
        validationCapture: error.errors,
      });

      return;
    }

    const data: z.infer<typeof registerSchema> = req.body;

    const IsUserInDb = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (IsUserInDb) {
      res.status(400).json({
        message: "user already exist",
      });

      return;
    }

    // All checks passed, create a new user

    const cryptedPassword = await encryptPassword(data.password);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: cryptedPassword,
      },
    });

    res.json({
      message: "User successfully created!",
      rawMessage: `${newUser.name} (ID: ${newUser.id}) has been created successfully. Welcome aboard!`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
