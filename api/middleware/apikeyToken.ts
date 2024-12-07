/** @format */

import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

export default async function apiKeyAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 1. Get the API key from the Authorization header
    const apiKey = req.headers["authorization"]?.split(" ")[1];

    if (!apiKey) {
      res.status(400).json({
        message: "API key is required for authentication",
      });
      return;
    }

    const apiKeyRecord = await prisma.apiKeys.findUnique({
      where: { key: apiKey },
      include: {
        user: true, // Assuming you want to access user data tied to the API key
      },
    });

    if (!apiKeyRecord) {
      res.status(401).json({
        message: "Invalid API key",
      });

      return;
    }

    if (!apiKeyRecord.isActive) {
      res.status(401).json({
        message: "API key is inactive",
      });

      return;
    }

    req.apiKeyData = apiKeyRecord;
    next();
  } catch (error) {
    next(error);
  }
}
