/** @format */

import { z } from "zod";

// Custom Zod validation for time formats like "10m", "90s", "1h"
export const timeFormatSchema = z.string().refine(
  (value) => {
    // Regex matches strings like 10m, 90s, 1h
    const timeRegex = /^(\d+)([smh])$/;
    return timeRegex.test(value);
  },
  {
    message:
      "Invalid time format. Use '10m' for minutes, '90s' for seconds, or '1h' for hours.",
  }
);

export const createRecipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Invalid URL for image"),
  mealType: z.string().min(1, "Meal type is required"),
  cuisine: z.string().min(1, "Cuisine type is required"),
  dietaryInfo: z
    .object({
      isVegetarian: z.boolean(),
      isVegan: z.boolean(),
      isGlutenFree: z.boolean(),
    })
    .optional(),
  prepTime: timeFormatSchema, // prepTime as a string with custom validation
  cookTime: timeFormatSchema, // cookTime as a string with custom validation
  servings: z.number().min(1, "Servings must be at least 1"),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, "Ingredient name is required"),
        quantity: z
          .string()
          .min(1, "Ingredient quantity is required"),
      })
    )
    .min(1, "At least one ingredient is required"),
  instructions: z
    .array(z.string().min(1, "Instruction is required"))
    .min(1, "At least one instruction is required"),
  tags: z.array(z.string()).optional(),
  source: z.string().url("Invalid URL for recipe source").optional(),
  video: z.string().url("Invalid video URL").optional(),
});
