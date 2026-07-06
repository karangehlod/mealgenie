import { describe, it, expect } from 'vitest';
import { DayContextSchema, MealPlanSchema } from './schemas';

describe('Zod Validation Schemas', () => {
  describe('DayContextSchema', () => {
    it('should validate correct DayContext data', () => {
      const validData = {
        diet: ['Vegan'],
        budget: 50,
        cookingTime: 30,
        servings: 4,
      };

      const result = DayContextSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid DayContext data', () => {
      const invalidData = {
        diet: [], // Needs at least 1 element
        budget: -10, // Must be positive
        cookingTime: 0, // Must be positive
        servings: 0, // Must be positive
      };

      const result = DayContextSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(3);
      }
    });
  });

  describe('MealPlanSchema', () => {
    it('should validate a correct MealPlan structural shape', () => {
      const validPlan = {
        breakfast: {
          name: 'Oatmeal',
          description: 'Oats with berries',
          ingredients: ['Oats', 'Berries', 'Water'],
          prepTime: '10 mins',
          calories: 300,
        },
        lunch: {
          name: 'Salad',
          description: 'Green leaf salad',
          ingredients: ['Lettuce', 'Dressing'],
          prepTime: '5 mins',
        },
        dinner: {
          name: 'Stir Fry',
          description: 'Tofu and veggies',
          ingredients: ['Tofu', 'Broccoli', 'Soy Sauce'],
          prepTime: '20 mins',
        },
      };

      const result = MealPlanSchema.safeParse(validPlan);
      expect(result.success).toBe(true);
    });
  });
});
