/** @format */

import { Router } from "express";
import { prisma } from "../db";
import { createRecipeSchema } from "../zod_schemas/rescipe";
import { z } from "zod";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: { ingredients: true, dietaryInfo: true },
    });

    res.status(200).json({ message: "here is the list ", recipes });
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req, res, next) => {
  try {
    const { userId } = req.apiKeyData || {};
    const { success, error } = createRecipeSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        message: "validation Error",
        validationError: error.errors,
      });
      return;
    }

    const data: z.infer<typeof createRecipeSchema> = req.body;

    const newResipe = await prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        mealType: data.mealType,
        cuisine: data.cuisine,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        servings: data.servings,
        instructions: data.instructions,
        tags: data.tags,
        source: data.source,
        video: data.video,
        dietaryInfo: { create: data.dietaryInfo },
        ingredients: { create: data.ingredients },
        createdbyId: userId as string,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/delete", (req, res, next) => {
  
});

export default router;
