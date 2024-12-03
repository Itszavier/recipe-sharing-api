/** @format */

import { Router } from "express";
import accessTokenAuth from "../middleware/accessToken";
import { prisma } from "../db";
import { uid } from "uid";
import { z } from "zod";
import { available_permissions } from "../utils/permissions";
import { customError } from "../utils/errorResponse";

const router = Router();

router.use(accessTokenAuth);

router.get("/", async (req, res, next) => {
  try {
    const { userId } = req.user || {};

    const keys = await prisma.apiKeys.findMany({
      where: { userId: userId },
    });

    res.status(200).json({
      message: "list of api keys share these with noone",
      keys: keys,
    });
  } catch (error) {
    next(error);
  }
});

const createApiKeySchema = z.object({
  name: z.string().max(255, "Name is too long").optional(), // Optional field with max length
  permissions: z.array(z.enum(available_permissions)).optional(), // At least one permission must be provided
});

router.post("/create", async (req, res, next) => {
  try {
    const { userId } = req.user || {};

    // Validate incoming request data
    const { error, success } = createApiKeySchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        message:
          "Validation failed. Please check your input and try again.",
        validationErrors: error.errors, // More descriptive name for error details
      });
      return;
    }

    // Safely extract validated data
    const data: z.infer<typeof createApiKeySchema> = req.body;

    // Generate a new unique API key
    const key = uid(38);

    // Store the new API key in the database
    const newKey = await prisma.apiKeys.create({
      data: {
        key,
        name: data.name,
        userId,
        permissions: data.permissions,
      }, // Handle optional permissions
    });

    // Return a successful response with the created key
    res.status(201).json({
      message: "Your API key has been successfully created!",
      api_key: newKey,
    });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
});

router.delete("/delete", async (req, res, next) => {
  try {
    // Extract the API key or the userId from the request
    const { userId } = req.user || {}; // Assuming userId is part of the authenticated user

    // Extract the key to be deleted from the request body
    const { key } = req.body;

    // Check if the API key exists
    if (!key) {
      next(customError(400, "API key is required for deletion"));
      return;
    }

    // Find the API key in the database
    const apiKey = await prisma.apiKeys.findUnique({
      where: { key },
    });

    // If the API key does not exist, return an error
    if (!apiKey) {
      next(customError(404, "API key not found"));
      return;
    }

    // Check if the user owns the API key (optional: this can be customized)
    if (apiKey.userId !== userId) {
      next(
        customError(
          403,
          "You are not authorized to delete this API key"
        )
      );

      return;
    }

    // Delete the API key from the database
    await prisma.apiKeys.delete({
      where: { key },
    });

    // Send a success response
    res.status(200).json({
      message: "API key deleted successfully",
    });
  } catch (error) {
    // Pass any errors to the global error handler
    next(error);
  }
});

export default router;
