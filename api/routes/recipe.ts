/** @format */

import { Router } from "express";
import { prisma } from "../db";
import { createRecipeSchema } from "../zod_schemas/rescipe";
import { z } from "zod";
import checkPermissions from "../utils/permissions";
import { customError } from "../utils/errorResponse";
import { requestLimiter } from "../utils/ratelimiter";
import { createRecipeWithIngredients } from "../functions/recipe";

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

    const newRecipe = await createRecipeWithIngredients(
      {
        ...data,
        createdbyId: userId as string,
      },
      data.dietaryInfo
    );

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
    const { limit = 10, page = 1 } = req.query;

    // Pagination calculation
    const skip =
      (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    // Fetch all recipes with pagination
    const recipes = await prisma.recipe.findMany({
      skip: skip,
      take: take,
      include: {
        ingredients: {
          include: {
            Ingredient: true,
          },
        },
      },
    });

    // Count total recipes for pagination
    const totalRecipes = await prisma.recipe.count();

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

router.get("/search", async function (req, res, next) {
  try {
    const {
      id,
      title,
      description,
      limit = 10,
      page = 1,
    } = req.query;

    // Pagination calculation
    const skip =
      (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    // Build the search filters dynamically
    const filters: any = {};

    // Search by recipe id (exact match)
    if (id) {
      filters.id = id as string; // Assuming id is passed as a string
    }

    // Search by recipe title
    if (title) {
      filters.title = {
        contains: title as string, // "like" search for title
        mode: "insensitive", // Case-insensitive search
      };
    }

    // Search by recipe description
    if (description) {
      filters.description = {
        contains: description as string, // "like" search for description
        mode: "insensitive", // Case-insensitive search
      };
    }

    // Fetch recipes with the dynamic filters and pagination
    const recipes = await prisma.recipe.findMany({
      where: filters,
      skip: skip,
      take: take,

      include: {
        ingredients: {
          include: {
            Ingredient: true,
          },
        },
      },
    });

    // Count total recipes for pagination
    const totalRecipes = await prisma.recipe.count({
      where: filters,
    });

    res.status(200).json({
      message: "Here is the list of recipes matching your search",
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
