/** @format */

import { Recipe, RecipeIngredient } from "@prisma/client";
import { prisma } from "../db";

interface IRecipeData {
  title: string; // Title of the recipe
  description: string; // Description of the recipe
  image?: string; // Optional image URL for the recipe
  mealType: string; // Type of meal (e.g., Dinner, Lunch)
  cuisine: string; // Cuisine type (e.g., Italian, Asian)
  prepTime: string; // Preparation time in minutes
  cookTime: string; // Cooking time in minutes
  servings: number; // Number of servings
  ingredients: {
    name: string; // Ingredient name (e.g., "Eggs", "Spaghetti")
    description?: string; // Optional description of the ingredient
    quantity: string; // Quantity of the ingredient (e.g., "2", "400g")
  }[]; // Array of ingredients used in the recipe
  instructions: string[]; // List of instructions for preparing the recipe
  tags?: string[]; // Optional list of tags (e.g., ["Pasta", "Quick"])
  source?: string; // Optional URL to the recipe source
  video?: string; // Optional video URL for the recipe
  createdbyId: string; // User ID who created the recipe
}

interface IDietaryInfo {
  // Dietary information for the recipe
  isVegetarian: boolean; // Is the recipe vegetarian?
  isVegan: boolean; // Is the recipe vegan?
  isGlutenFree: boolean; // Is the recipe gluten-free?
  recipeId?: string;
}

export async function createRecipeWithIngredients(
  recipe: IRecipeData,
  dietaryInfo?: IDietaryInfo
) {
  const { ingredients, ...rest } = recipe;

  const ingredientsToUse = await Promise.all(
    ingredients.map(async (ingredient, index) => {
      return await prisma.ingredient.upsert({
        where: { name: ingredient.name },
        update: {},
        create: {
          name: ingredient.name,
          description: ingredient.description,
        },
      });
    })
  );

  return await prisma.recipe.create({
    data: {
      ...rest,
      dietaryInfo: dietaryInfo
        ? { create: dietaryInfo } // Create dietary info if provided
        : undefined,

      ingredients: {
        create: ingredientsToUse.map((ingredient, index) => {
          return {
            ingredientId: ingredient.id,
            name: ingredient.name,
            quantity: ingredients[index].quantity,
          };
        }),
      },
    },

    include: {
      dietaryInfo: true,
      ingredients: {
        include: {
          Ingredient: { include: { recipes: true } },
          recipe: true,
        },
      },
    },
  });
}
