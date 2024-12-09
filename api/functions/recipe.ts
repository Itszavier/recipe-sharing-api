/** @format */

import z, { promise, RawCreateParams, string } from "zod";

import { prisma } from "../config/db";

import {
  Ingredients,
  Nutritions,
  RecipeIngredients,
  RecipeInstructions,
  Recipes,
} from "@prisma/client";

class Recipe {
  constructor() {}

  async createIngredients(
    data: {
      name: string;
      description?: string;
      image?: string;
      userid?: string;
    }[]
  ) {
    const ingredientsToUse = await Promise.all(
      data.map(async (ingredient, index) => {
        return await prisma.ingredients.upsert({
          where: { name: ingredient.name },
          update: {},
          create: {
            name: ingredient.name,
            description: ingredient.description,
            image: ingredient.image,
          },
        });
      })
    );

    return ingredientsToUse;
  }

  async createNutritions(
    data: {
      name: string;
      quantity: string;
      image?: string;
      description?: string;
      userId?: string;
    }[]
  ) {
    const nutritionsToUse = await Promise.all(
      data.map(async (nutritions, index) => {
        return await prisma.nutritions.upsert({
          where: { name: nutritions.name },
          update: {},
          create: {
            name: nutritions.name,
            description: nutritions.description,
            category: "Unkown",
            image: nutritions.image,
            authorId: nutritions.userId,
          },
        });
      })
    );

    return nutritionsToUse;
  }

  async create(data: {
    ingredients: Ingredients[];
    nutritions: Nutritions[];
    instructions: RecipeInstructions[];
    recipeDetails: Omit<
      Recipes,
      " ingredients" | "id" | "instructions" | "nutritions"
    >;
  }) {
    await prisma.recipes.create({
      data: {
        ...data.recipeDetails,
       // dietaryInfo: { create: data.recipeDetails.d },
      },
    });
  }
}