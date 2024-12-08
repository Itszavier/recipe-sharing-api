/** @format */
import { z } from "zod";

// Custom Zod validation for time formats like "10m", "90s", "1h"
export const timeFormatSchema = z.string().refine(
  (value) => {
    const timeRegex = /^(\d+)([smh])$/; // Matches valid time formats
    return timeRegex.test(value);
  },
  {
    message:
      "Invalid time format. Use '10m' for minutes, '90s' for seconds, or '1h' for hours.",
  }
);

// Instruction Schema
export const instructionSchema = z.object({
  text: z.string().min(1, "Instruction text is required"),
  image: z
    .string()
    .url("Invalid URL for instruction image")
    .optional(),
});

// Schema for ingredients with validation logic
export const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.string().min(1, "Ingredient quantity is required"),
});

// Schema for dietary info
export const dietaryInfoSchema = z.object({
  isVegetarian: z.boolean(),
  isVegan: z.boolean(),
  isGlutenFree: z.boolean(),
});

// Main create recipe schema
export const createRecipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Invalid URL for recipe image"), // Validates recipe image
  mealType: z.nativeEnum({
    BREAKFAST: "BREAKFAST",
    BRUNCH: "BRUNCH",
    LUNCH: "LUNCH",
    DINNER: "DINNER",
    SNACK: "SNACK",
    DESSERT: "DESSERT",
    APPETIZER: "APPETIZER",
    MAIN_COURSE: "MAIN_COURSE",
    SIDE_DISH: "SIDE_DISH",
    BEVERAGE: "BEVERAGE",
    SOUP: "SOUP",
    SALAD: "SALAD",
    BREAD: "BREAD",
    SAUCE: "SAUCE",
    PARTY_FOOD: "PARTY_FOOD",
    MIDNIGHT_SNACK: "MIDNIGHT_SNACK",
  }),
  cuisine: z.string().min(1, "Cuisine type is required"),
  dietaryInfo: dietaryInfoSchema.optional(),
  prepTime: timeFormatSchema,
  cookTime: timeFormatSchema,
  servings: z.number().min(1, "Servings must be at least 1"),
  difficulty: z
    .nativeEnum({
      EASY: "EASY",
      MEDIUM: "MEDIUM",
      HARD: "HARD",
    })
    .optional(),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "At least one ingredient is required"),
  instructions: z
    .array(instructionSchema)
    .min(1, "At least one instruction is required"),
  tags: z.array(z.string()),
  source: z.string().url("Invalid URL for recipe source").optional(),
  video: z.string().url("Invalid video URL").optional(),
});
