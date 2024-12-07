/** @format */

import { NextFunction, Request, Response } from "express";
import { AvailablePermissions } from "../../../utils/permissions";
import { customError } from "../../../functions/errorResponse";
import {
  comparePassword,
  encryptPassword,
  generateToken,
} from "../../../utils/functions";
import { prisma } from "../../../config/db";
import { loginSchema, registerSchema } from "../../../schemas/auth";
import { z } from "zod";

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { error, success } = registerSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        message: "validation error",
        validationErrors: error.errors,
      });

      return;
    }

    const data: z.infer<typeof registerSchema> = req.body;

    const IsUserInDb = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (IsUserInDb) {
      next(customError(401, "user already exist"));
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
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { error, success } = loginSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        message: "Validation error",
        validationError: error.errors,
      });

      return;
    }

    const data: z.infer<typeof loginSchema> = req.body;

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // If user not found or password is invalid
    if (
      !user ||
      !(await comparePassword(data.password, user.password))
    ) {
      next(customError(401, "Invalid email or password"));
      return;
    }

    const token = generateToken(user.id, [
      AvailablePermissions.CreateApiKey,
      AvailablePermissions.CreateRecipe,
    ]);

    const accessToken = `Bearer ${token}`; // Add any other claims you need here)}`;

    res.status(200).json({
      message: "user successfully logged in",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
}
