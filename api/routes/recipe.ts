/** @format */

import { Router } from "express";
import { prisma } from "../db";
import { createRecipeSchema } from "../zod_schemas/rescipe";
import { z } from "zod";
import checkPermissions from "../utils/permissions";

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

    res
      .status(200)
      .json({ message: "Recipe created successfully!", newResipe });
  } catch (error) {
    next(error);
  }
});


router.delete("/delete/:recipeId", async (req, res, next) => {
  try {
    const { userId } = req.apiKeyData || {};
    const recipeId = req.params.recipeId;

    // Check if the recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      res.status(404).json({
        message:
          "Recipe not found. It may have already been deleted.",
      });
      return;
    }

    // Verify the user is the creator of the recipe
    if (recipe.createdbyId !== userId) {
      res.status(403).json({
        message: "You are not authorized to delete this recipe.",
      });
      return;
    }

    // Delete the recipe
    await prisma.recipe.delete({ where: { id: recipeId } });

    res.status(200).json({
      message: "Recipe deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
