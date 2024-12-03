/** @format */

import { Router } from "express";
import { prisma } from "../db";
import { createRecipeSchema } from "../zod_schemas/rescipe";
import { z } from "zod";
import checkPermissions from "../utils/permissions";
import { customError } from "../utils/errorResponse";
import { requestLimiter } from "../utils/ratelimiter";

const router = Router();

router.post("/create", async function (req, res, next) {
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

    const newRecipe = await prisma.recipe.create({
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

    res.status(200).json({
      message: "Recipe created successfully!",
      recipe: newRecipe,
    });
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/delete/:recipeId",
  requestLimiter,
  async function (req, res, next) {
    try {
      const { userId } = req.apiKeyData || {};
      const recipeId = req.params.recipeId;

      // Check if the recipe exists
      const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
      });

      if (!recipe) {
        next(
          customError(
            404,
            "Recipe not found. It may have already been deleted."
          )
        );
        return;
      }

      // Verify the user is the creator of the recipe
      if (recipe.createdbyId !== userId) {
        next(
          customError(
            403,
            "You are not authorized to delete this recipe."
          )
        );
        return;
      }

      await prisma.dietaryInfo.delete({
        where: { recipeId: recipeId },
      });

      await prisma.ingredient.deleteMany({
        where: { recipeId: recipeId },
      });
      // Delete the recipe
      await prisma.recipe.delete({ where: { id: recipeId } });

      res.status(200).json({
        message: "Recipe deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/", async function (req, res, next) {
  try {
    const {
      id,
      name,
      ingredient,
      dietaryInfo,
      description,
      limit = 10,
      page = 1,
    } = req.query;

    // Building the query filters dynamically
    const filters: any = {};

    // Search by recipe id (exact match)
    if (id) {
      filters.id = parseInt(id as string); // Ensure id is an integer
    }

    // Search by recipe name
    if (name) {
      filters.name = {
        contains: name as string, // Perform a "like" search for name
        mode: "insensitive", // Make the search case-insensitive
      };
    }

    // Search by ingredient name (ingredients must be associated with the recipe)
    if (ingredient) {
      filters.ingredients = {
        some: {
          name: {
            contains: ingredient as string,
            mode: "insensitive",
          },
        },
      };
    }

    // Search by dietary information
    if (dietaryInfo) {
      filters.dietaryInfo = {
        some: {
          type: {
            contains: dietaryInfo as string,
            mode: "insensitive",
          },
        },
      };
    }

    // Search by description
    if (description) {
      filters.description = {
        contains: description as string, // Perform a "like" search for description
        mode: "insensitive", // Make the search case-insensitive
      };
    }

    // Pagination
    const skip =
      (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    // Fetch recipes with the filters and pagination
    const recipes = await prisma.recipe.findMany({
      where: filters,
      include: { ingredients: true, dietaryInfo: true },
      skip: skip,
      take: take,
    });

    // Count total recipes for pagination
    const totalRecipes = await prisma.recipe.count({
      where: filters,
    });

    res.status(200).json({
      message: "Here is the list of recipes",
      recipes,
      totalRecipes,
      totalPages: Math.ceil(totalRecipes / take),
      currentPage: parseInt(page as string),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
