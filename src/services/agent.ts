import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  MealPlanSchema,
  GroceryListSchema,
  SubstitutionsListSchema,
  BudgetCheckSchema,
} from '../utils/schemas';
import type { DayContext, MealPlan, GroceryList, Substitution, BudgetCheck } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);
// Using gemini-1.5-flash for faster responses in MVP, or gemini-1.5-pro for better reasoning
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const jsonInstruction = "Return ONLY valid JSON. Do not include markdown blocks, backticks, or explanations.";

export const agent = {
  async generateMealPlan(context: DayContext): Promise<MealPlan> {
    const prompt = `
      You are an expert AI chef. Generate a daily meal plan based on the following context:
      Diet: ${context.diet}
      Budget: $${context.budget}
      Max Cooking Time: ${context.cookingTime} minutes total for the day
      Allergies/Restrictions: ${context.allergies || 'None'}
      Servings: ${context.servings}

      ${jsonInstruction}
      Output JSON strictly matching this schema:
      {
        "breakfast": { "name": string, "description": string, "ingredients": string[], "prepTime": string },
        "lunch": { "name": string, "description": string, "ingredients": string[], "prepTime": string },
        "dinner": { "name": string, "description": string, "ingredients": string[], "prepTime": string }
      }
    `;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return MealPlanSchema.parse(JSON.parse(cleanJSON(text)));
  },

  async generateGroceryList(mealPlan: MealPlan): Promise<GroceryList> {
    const prompt = `
      You are an AI assistant. Extract a categorized grocery list from the following meal plan:
      ${JSON.stringify(mealPlan, null, 2)}

      ${jsonInstruction}
      Output JSON strictly matching this schema:
      {
        "produce": string[],
        "proteins": string[],
        "dairy": string[],
        "pantry": string[],
        "spices": string[],
        "other": string[]
      }
    `;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return GroceryListSchema.parse(JSON.parse(cleanJSON(text)));
  },

  async getSubstitutions(mealPlan: MealPlan): Promise<Substitution[]> {
    const prompt = `
      You are an expert nutritionist. Review this meal plan and provide common dietary or allergy substitutions for main ingredients.
      ${JSON.stringify(mealPlan, null, 2)}
      If no substitutions are necessary or obvious, return an empty array [].

      ${jsonInstruction}
      Output JSON strictly matching this schema (array of objects):
      [
        {
          "ingredient": string,
          "substitute": string,
          "reason": string
        }
      ]
    `;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return SubstitutionsListSchema.parse(JSON.parse(cleanJSON(text)));
  },

  async checkBudget(groceryList: GroceryList, budget: number): Promise<BudgetCheck> {
    const prompt = `
      You are a budget assistant. Estimate the cost of this grocery list and determine if it fits within the $${budget} budget.
      ${JSON.stringify(groceryList, null, 2)}

      ${jsonInstruction}
      Output JSON strictly matching this schema:
      {
        "estimatedCost": number,
        "feasible": boolean,
        "alternatives": string[],
        "summary": string
      }
    `;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return BudgetCheckSchema.parse(JSON.parse(cleanJSON(text)));
  }
};

function cleanJSON(str: string): string {
  // Remove markdown json blocks if Gemini includes them
  let cleaned = str.trim();
  if (cleaned.startsWith('\`\`\`json')) {
    cleaned = cleaned.replace(/^\`\`\`json\n/, '');
  } else if (cleaned.startsWith('\`\`\`')) {
    cleaned = cleaned.replace(/^\`\`\`\n/, '');
  }
  if (cleaned.endsWith('\`\`\`')) {
    cleaned = cleaned.replace(/\n?\`\`\`$/, '');
  }
  return cleaned.trim();
}
