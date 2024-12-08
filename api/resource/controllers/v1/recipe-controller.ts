/** @format */

import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../config/db";
import { customError } from "../../../functions/errorResponse";
import { createRecipeSchema } from "../../../schemas/rescipe";
import { z } from "zod";

export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { limit = 10, page = 1 } = req.query;

    // Pagination calculation
    const skip =
      (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    // Fetch all recipes with pagination
    const recipes = await prisma.recipes.findMany({
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
    const totalRecipes = await prisma.recipes.count();

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
}

export async function search(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
    const recipes = await prisma.recipes.findMany({
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
    const totalRecipes = await prisma.recipes.count({
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
}

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { success, error } = createRecipeSchema.safeParse(req.body);

    if (!success) {
      res.status(200).json({
        success: false,
        message: "validation error",
        validationErrors: error.errors,
      });
      return;
    }

    const {
      ingredients,
      instructions,
      dietaryInfo,
      ...recipeDetails
    }: z.infer<typeof createRecipeSchema> = req.body;

    /* const ingredientsToUse = await Promise.all(
      ingredients.map(async function (ingredient, index) {
        return await prisma.ingredients.upsert({
          where: { name: ingredient.name },
          update: {},
          create: { name: ingredient.name },
        });
      })
    );

    await prisma.recipes.create({
      data: { ...recipeDetails, ingredients: {} },
    });

    */
  } catch (error) {
    next(error);
  }
}

export async function deleteById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.apiKeyData || {};
    const recipeId = req.params.recipeId;

    // Check if the recipe exists
    const recipe = await prisma.recipes.findUnique({
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
    await prisma.recipes.delete({ where: { id: recipeId } });

    res.status(200).json({
      message: "Recipe deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}
