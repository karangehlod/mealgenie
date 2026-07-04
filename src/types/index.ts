import { z } from 'zod';
import {
  DayContextSchema,
  MealPlanSchema,
  GroceryListSchema,
  SubstitutionSchema,
  BudgetCheckSchema,
} from '../utils/schemas';

export type DayContext = z.infer<typeof DayContextSchema>;
export type MealPlan = z.infer<typeof MealPlanSchema>;
export type GroceryList = z.infer<typeof GroceryListSchema>;
export type Substitution = z.infer<typeof SubstitutionSchema>;
export type BudgetCheck = z.infer<typeof BudgetCheckSchema>;
