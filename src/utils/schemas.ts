import { z } from 'zod';

export const DayContextSchema = z.object({
  diet: z.string().min(1, "Diet is required"),
  budget: z.number().positive("Budget must be positive"),
  cookingTime: z.number().positive("Cooking time must be positive"),
  allergies: z.string(),
  servings: z.number().int().positive("Servings must be a positive integer"),
});

export const MealSchema = z.object({
  name: z.string(),
  description: z.string(),
  ingredients: z.array(z.string()),
  prepTime: z.string(),
});

export const MealPlanSchema = z.object({
  breakfast: MealSchema,
  lunch: MealSchema,
  dinner: MealSchema,
});

export const GroceryListSchema = z.object({
  produce: z.array(z.string()),
  proteins: z.array(z.string()),
  dairy: z.array(z.string()),
  pantry: z.array(z.string()),
  spices: z.array(z.string()),
  other: z.array(z.string()),
});

export const SubstitutionSchema = z.object({
  ingredient: z.string(),
  substitute: z.string(),
  reason: z.string(),
});

export const SubstitutionsListSchema = z.array(SubstitutionSchema);

export const BudgetCheckSchema = z.object({
  estimatedCost: z.number(),
  feasible: z.boolean(),
  alternatives: z.array(z.string()),
  summary: z.string(),
});
