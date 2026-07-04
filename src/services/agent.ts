
import {
  MealPlanSchema,
  GroceryListSchema,
  SubstitutionsListSchema,
  BudgetCheckSchema,
} from '../utils/schemas';
import type { DayContext, MealPlan, GroceryList, Substitution, BudgetCheck } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

if (import.meta.env.DEV) {
  console.log(`[Gemini] API Key detected: ${!!apiKey} (${apiKey ? apiKey.substring(0, 5) + '...' : 'empty'})`);
  console.log(`[Gemini] Selected model: gemini-3.1-flash-lite`);
  if (apiKey && apiKey.startsWith('AQ.')) {
    console.warn('[Gemini] WARNING: API key starts with "AQ." (OAuth token). These have exhausted free tier quota. Get a proper API key (starts with "AIza...") from https://aistudio.google.com/apikey');
  }
}

const jsonInstruction = "Return ONLY valid JSON. Do not include markdown blocks, backticks, or explanations.";

async function makeGeminiRequest(prompt: string): Promise<string> {
  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Please add `VITE_GEMINI_API_KEY` to your `.env` file and restart the development server.");
  }

  const cleanKey = apiKey.trim();

  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-goog-api-key": cleanKey
  };

  if (import.meta.env.DEV) console.log("[Gemini] Request start via REST...");
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const errMessage = errBody.error?.message || response.statusText;
      const status = response.status;
      
      if (import.meta.env.DEV) console.log(`[Gemini] Request failure (${status})`, errBody);

      if (status === 401 || status === 403 || errMessage.includes("unregistered callers")) {
        throw new Error(
          `Authentication failed (${status}): ${errMessage}\n\n` +
          "Likely causes:\n" +
          "• The key starting with 'AQ.' requires authorization header credentials (check if the token has expired or is blocked)\n" +
          "• The API Key is blocked by service restrictions\n" +
          "• The model 'gemini-3.1-flash-lite' is not enabled or quota is exhausted\n" +
          "• Gemini API is not enabled for your Google Cloud Project"
        );
      }
      throw new Error(`Gemini API Error (${status}): ${errMessage}`);
    }

    const resJson = await response.json();
    const text = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error("Received an empty response from Gemini.");
    }

    if (import.meta.env.DEV) console.log("[Gemini] Request success (Status: 200)");
    return text;
  } catch (error: any) {
    if (import.meta.env.DEV) console.log("[Gemini] Request error", error);
    throw error;
  }
}

export const agent = {
  async generateMealPlan(context: DayContext): Promise<MealPlan> {
    const prompt = `
      You are an expert AI chef specialized in creating highly personalized daily meal plans.
      Context:
      - Diet Preferences: ${context.diet.join(', ')}
      - Budget: $${context.budget}
      - Max Cooking Time: ${context.cookingTime} minutes total for the day
      - Allergies: ${context.allergies?.join(', ') || 'None'}
      - Ingredients to Avoid: ${context.ingredientsToAvoid || 'None'}
      - Preferred Cuisine: ${context.preferredCuisine || 'Any'}
      - Additional Notes: ${context.additionalNotes || 'None'}
      - Servings per meal: ${context.servings}

      Create a diverse, delicious, and culturally appropriate (if cuisine is specified) daily meal plan.
      
      ${jsonInstruction}
      Output JSON strictly matching this schema:
      {
        "breakfast": { "name": "string", "description": "string", "ingredients": ["string"], "prepTime": "string", "calories": number },
        "lunch": { "name": "string", "description": "string", "ingredients": ["string"], "prepTime": "string", "calories": number },
        "dinner": { "name": "string", "description": "string", "ingredients": ["string"], "prepTime": "string", "calories": number }
      }
    `;
    const text = await makeGeminiRequest(prompt);
    return MealPlanSchema.parse(JSON.parse(cleanJSON(text)));
  },

  async generateGroceryList(mealPlan: MealPlan): Promise<GroceryList> {
    const prompt = `
      You are a precise AI assistant. Extract a categorized grocery list from the following meal plan.
      Group ingredients logically. Do not duplicate ingredients if they appear in multiple meals (combine them).
      ${JSON.stringify(mealPlan, null, 2)}

      ${jsonInstruction}
      Output JSON strictly matching this schema:
      {
        "produce": ["string"],
        "proteins": ["string"],
        "dairy": ["string"],
        "pantry": ["string"],
        "spices": ["string"],
        "other": ["string"]
      }
    `;
    const text = await makeGeminiRequest(prompt);
    return GroceryListSchema.parse(JSON.parse(cleanJSON(text)));
  },

  async getSubstitutions(mealPlan: MealPlan): Promise<Substitution[]> {
    const prompt = `
      You are an expert nutritionist. Review this meal plan and provide common dietary or allergy substitutions for the main ingredients.
      Prioritize making suggestions that are allergy-safe or healthier.
      ${JSON.stringify(mealPlan, null, 2)}
      If no substitutions are necessary, return an empty array [].

      ${jsonInstruction}
      Output JSON strictly matching this schema (array of objects):
      [
        {
          "ingredient": "string",
          "substitute": "string",
          "reason": "string",
          "isAllergySafe": boolean
        }
      ]
    `;
    const text = await makeGeminiRequest(prompt);
    return SubstitutionsListSchema.parse(JSON.parse(cleanJSON(text)));
  },

  async checkBudget(groceryList: GroceryList, budget: number): Promise<BudgetCheck> {
    const prompt = `
      You are a frugal financial planner and culinary expert.
      Estimate the real-world cost of this grocery list and determine if it fits within the $${budget} daily budget.
      ${JSON.stringify(groceryList, null, 2)}

      ${jsonInstruction}
      Output JSON strictly matching this schema:
      {
        "estimatedCost": number,
        "feasible": boolean,
        "alternatives": ["string"],
        "summary": "string"
      }
    `;
    const text = await makeGeminiRequest(prompt);
    return BudgetCheckSchema.parse(JSON.parse(cleanJSON(text)));
  }
};

function cleanJSON(str: string): string {
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\n/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\n?```$/, '');
  }
  return cleaned.trim();
}
