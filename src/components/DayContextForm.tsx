import { useState } from 'react';
import { z } from 'zod';
import { Card, Button, ErrorState } from './common/UI';
import { FadeIn } from './common/Animations';
import { usePlannerStore } from '../store/usePlannerStore';
import { DayContextSchema } from '../utils/schemas';
import { cn } from '../utils/cn';
import { 
  Heart, Wallet, Clock, Users, ShieldAlert, Sparkles, Utensils, Info 
} from 'lucide-react';

const DIET_OPTIONS = [
  "Vegetarian", "Vegan", "Eggetarian", "Jain", "Satvik", "Pure Vegetarian", 
  "Non-Vegetarian", "Chicken Preferred", "Fish Preferred", "Mutton Preferred",
  "South Indian", "North Indian", "Gujarati", "Punjabi", "Bengali", 
  "Maharashtrian", "Rajasthani", "Chettinad", "Kerala Style", "Hyderabadi",
  "Millet-Based", "High Protein", "Low Carb", "Keto", "Diabetic Friendly", 
  "Low Sodium", "Heart Healthy", "Gluten Free", "Lactose Free"
];

export const DayContextForm = () => {
  const { dayContext, setDayContext } = usePlannerStore();
  const [formData, setFormData] = useState({
    diet: dayContext?.diet || [] as string[],
    budget: dayContext?.budget?.toString() || '50',
    cookingTime: dayContext?.cookingTime?.toString() || '60',
    servings: dayContext?.servings?.toString() || '2',
    allergies: dayContext?.allergies?.join(', ') || '',
    ingredientsToAvoid: dayContext?.ingredientsToAvoid || '',
    preferredCuisine: dayContext?.preferredCuisine || '',
    additionalNotes: dayContext?.additionalNotes || '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleDiet = (option: string) => {
    setFormData(prev => ({
      ...prev,
      diet: prev.diet.includes(option) 
        ? prev.diet.filter(d => d !== option)
        : [...prev.diet, option]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const parsed = DayContextSchema.safeParse({
      ...formData,
      budget: parseFloat(formData.budget),
      cookingTime: parseInt(formData.cookingTime, 10),
      servings: parseInt(formData.servings, 10),
      allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()).filter(Boolean) : undefined,
    });

    if (!parsed.success) {
      setValidationError(parsed.error.issues.map((err: z.ZodIssue) => err.message).join(', '));
      return;
    }

    setDayContext(parsed.data);
  };

  return (
    <FadeIn>
      <Card>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Your Meal Plan</h2>
          <p className="text-gray-500 dark:text-slate-400">Customize your daily menu based on your preferences, budget, and time.</p>
        </div>
        
        {validationError && (
          <div className="mb-6">
            <ErrorState message={validationError} />
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Diet Preferences - Multi Select */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-slate-200 mb-3">
              <Heart size={18} className="text-rose-500" /> 
              Dietary Preferences & Cuisines
            </label>
            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-100 dark:border-slate-850">
              {DIET_OPTIONS.map(option => {
                const isSelected = formData.diet.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleDiet(option)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                      isSelected 
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none scale-105" 
                        : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800"
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {formData.diet.length === 0 && <p className="text-xs text-red-500 mt-2">Please select at least one option.</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Budget */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-slate-200 mb-2">
                <Wallet size={18} className="text-emerald-500" /> Daily Budget ($)
              </label>
              <input
                type="number"
                min="1"
                step="any"
                className="w-full rounded-xl border-gray-200 dark:border-slate-800 border bg-gray-50 dark:bg-slate-950 p-3 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 dark:text-white transition-all outline-none"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>
            
            {/* Cooking Time */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-slate-200 mb-2">
                <Clock size={18} className="text-indigo-500" /> Max Time (mins/day)
              </label>
              <input
                type="number"
                min="1"
                className="w-full rounded-xl border-gray-200 dark:border-slate-800 border bg-gray-50 dark:bg-slate-950 p-3 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 dark:text-white transition-all outline-none"
                value={formData.cookingTime}
                onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
              />
            </div>

            {/* Servings */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-slate-200 mb-2">
                <Users size={18} className="text-blue-500" /> Servings / Meal
              </label>
              <input
                type="number"
                min="1"
                className="w-full rounded-xl border-gray-200 dark:border-slate-800 border bg-gray-50 dark:bg-slate-950 p-3 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 dark:text-white transition-all outline-none"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Allergies */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-slate-200 mb-2">
                <ShieldAlert size={18} className="text-red-500" /> Allergies
              </label>
              <input
                type="text"
                className="w-full rounded-xl border-gray-200 dark:border-slate-800 border bg-gray-50 dark:bg-slate-950 p-3 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 dark:text-white transition-all outline-none"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="e.g., Peanuts, shellfish (comma separated)"
              />
            </div>
            
            {/* Ingredients to Avoid */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-slate-200 mb-2">
                <Info size={18} className="text-orange-500" /> Avoid Ingredients
              </label>
              <input
                type="text"
                className="w-full rounded-xl border-gray-200 dark:border-slate-800 border bg-gray-50 dark:bg-slate-950 p-3 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 dark:text-white transition-all outline-none"
                value={formData.ingredientsToAvoid}
                onChange={(e) => setFormData({ ...formData, ingredientsToAvoid: e.target.value })}
                placeholder="e.g., Cilantro, mushrooms"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preferred Cuisine (Open text if not in diet) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-slate-200 mb-2">
                <Utensils size={18} className="text-purple-500" /> Specific Cuisine (Optional)
              </label>
              <input
                type="text"
                className="w-full rounded-xl border-gray-200 dark:border-slate-800 border bg-gray-50 dark:bg-slate-950 p-3 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 dark:text-white transition-all outline-none"
                value={formData.preferredCuisine}
                onChange={(e) => setFormData({ ...formData, preferredCuisine: e.target.value })}
                placeholder="e.g., Italian, Mexican fusion"
              />
            </div>
            
            {/* Additional Notes */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-slate-200 mb-2">
                <Sparkles size={18} className="text-yellow-500" /> Additional Notes
              </label>
              <input
                type="text"
                className="w-full rounded-xl border-gray-200 dark:border-slate-800 border bg-gray-50 dark:bg-slate-950 p-3 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 dark:text-white transition-all outline-none"
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                placeholder="e.g., I love spicy food"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" disabled={formData.diet.length === 0} className="w-full sm:w-auto text-lg px-8">
              Generate My Plan <Sparkles size={18} className="ml-2" />
            </Button>
          </div>
        </form>
      </Card>
    </FadeIn>
  );
};
