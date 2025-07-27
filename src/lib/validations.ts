import { z } from "zod";

export const userProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(1).max(120).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  height: z.number().min(50).max(300).optional(), // in cm
  weight: z.number().min(20).max(500).optional(), // in kg
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extremely_active",
  ]).optional(),
});

export const foodItemSchema = z.object({
  name: z.string().min(1, "Food name is required"),
  brand: z.string().optional(),
  barcode: z.string().optional(),
  calories: z.number().min(0, "Calories must be positive"),
  protein: z.number().min(0, "Protein must be positive"),
  carbs: z.number().min(0, "Carbs must be positive"),
  fat: z.number().min(0, "Fat must be positive"),
  fiber: z.number().min(0, "Fiber must be positive"),
  sugar: z.number().min(0, "Sugar must be positive"),
  sodium: z.number().min(0, "Sodium must be positive"),
  servingSize: z.number().min(0.1, "Serving size must be positive"),
  servingUnit: z.string().min(1, "Serving unit is required"),
});

export const recipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  description: z.string().optional(),
  instructions: z.string().min(1, "Instructions are required"),
  prepTime: z.number().min(0).optional(),
  cookTime: z.number().min(0).optional(),
  servings: z.number().min(1, "Servings must be at least 1"),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  category: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  ingredients: z.array(z.object({
    foodId: z.string().min(1, "Food item is required"),
    quantity: z.number().min(0.1, "Quantity must be positive"),
    unit: z.string().min(1, "Unit is required"),
  })).min(1, "At least one ingredient is required"),
});

export const mealPlanSchema = z.object({
  name: z.string().min(1, "Meal plan name is required"),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  items: z.array(z.object({
    date: z.date(),
    mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
    recipeId: z.string().optional(),
    quantity: z.number().min(0.1).default(1),
  })).min(1, "At least one meal is required"),
});

export const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  category: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
}); 