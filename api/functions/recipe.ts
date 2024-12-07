/** @format */

import { prisma } from "../db";

interface IRecipeData {
  title: string;
  description: string;
  image?: string;
  mealType: string;
  cuisine: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: {
    name: string;
    description?: string;
    quantity: string;
  }[];
  tags?: string[];
  source?: string;
  video?: string;
  createdbyId: string;
}

interface IIngredients {
  name: string;
  description?: string;
  quantity: string;
}
interface IDietaryInfo {
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  recipeId?: string;
}

interface IInstructions {
  text: string;
  image?: string;
}

async function createIngredients(ingredients: IIngredients[]) {
  const ingredientsToUse = await Promise.all(
    ingredients.map(
      async (ingredient) =>
        await prisma.ingredients.upsert({
          where: { name: ingredient.name },
          update: {},
          create: {
            name: ingredient.name,
            description: ingredient.description,
          },
        })
    )
  );

  return ingredientsToUse;
}

export async function createRecipe(data: {
  recipe: IRecipeData;
  instructions: IInstructions[];
  dietaryInfo?: IDietaryInfo;
}) {
  /*
  try {
    const { recipe, instructions, dietaryInfo } = data;
    const { ingredients, ...recipeDetails } = recipe;

    // Upsert ingredients
    const ingredientsToUse = await createIngredients(ingredients);
    
    // Create recipe
    return await prisma.recipes.create({
      data: {
        ...recipeDetails,
        dietaryInfo: dietaryInfo
           ? { create: dietaryInfo }
          : undefined,
        ingredients: {
          create: ingredientsToUse.map((ingredient, index) => ({
            ingredientId: ingredient.id,
            name: ingredient.name,
            quantity: ingredients[index].quantity,
          })),
        },
        instructions: { create: instructions },
      },
      include: {
        dietaryInfo: true,
        ingredients: { include: { Ingredient: true } },
      },
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw new Error("Failed to create recipe.");
  }*/
}
