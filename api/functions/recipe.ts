/** @format */

import { intersection } from "zod";
import { prisma } from "../config/db";

import {
  Ingredients,
  Nutritions,
  RecipeIngredients,
  RecipeInstructions,
  Recipes,
} from "@prisma/client";

type TCreateNutritionsReturnType = Nutritions & {
  amount: number;
  unit: string;
  details?: string;
};

type TCreateIngredientReturnType = Ingredients & { quantity: string };

interface NutritionInput {
  name: string;
  amount: number;
  unit: string;
  image?: string;
  description?: string;
  userId?: string;
}

interface IngredientsInput {
  name: string;
  description?: string;
  image?: string;
  userid?: string;
  quantity: string;
}

class Recipe {
  async createIngredients(
    data: IngredientsInput[]
  ): Promise<TCreateIngredientReturnType[]> {
    const ingredientsToUse = await Promise.all(
      data.map(async (ingredient, index) => {
        const result = await prisma.ingredients.upsert({
          where: { name: ingredient.name },
          update: {},
          create: {
            name: ingredient.name,
            description: ingredient.description,
            image: ingredient.image,
          },
        });

        return {
          ...result,
          quantity: ingredient.quantity,
        } as TCreateIngredientReturnType;
      })
    );

    return ingredientsToUse;
  }

  async createNutritions(
    data: NutritionInput[]
  ): Promise<TCreateNutritionsReturnType[]> {
    const nutritionsToUse = await Promise.all(
      data.map(async (nutritions, index) => {
        const nutrition = await prisma.nutritions.upsert({
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

        return {
          ...nutrition,
          unit: nutritions.unit,
          amount: nutritions.amount,
        } as TCreateNutritionsReturnType;
      })
    );

    return nutritionsToUse;
  }

  async create(data: {
    ingredients: TCreateIngredientReturnType[];
    nutritions: TCreateNutritionsReturnType[];
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
        nutritions: {
          create: data.nutritions.map((nutrition, index) => {
            return {
              name: nutrition.name,
              amount: nutrition.amount,
              unit: nutrition.unit,
              nutritionId: nutrition.id,
              details: nutrition.details,
            };
          }),
        },

        instructions: {
          create: data.instructions.map((instruction, index) => {
            return {
              text: instruction.text,
              image: instruction.image,
            };
          }),
        },

        ingredients: {
          create: data.ingredients.map((ingredient, index) => {
            return {
              name: ingredient.name,
              ingredientId: ingredient.id,
              quantity: ingredient.quantity,
            };
          }),
        },
      },
    });
  }
}
