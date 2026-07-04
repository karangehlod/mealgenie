import { useState } from 'react';
import { z } from 'zod';
import { Card, Button, ErrorState } from './common/UI';
import { usePlannerStore } from '../store/usePlannerStore';
import { DayContextSchema } from '../utils/schemas';

export const DayContextForm = () => {
  const { dayContext, setDayContext } = usePlannerStore();
  const [formData, setFormData] = useState({
    diet: dayContext?.diet || 'Omnivore',
    budget: dayContext?.budget?.toString() || '50',
    cookingTime: dayContext?.cookingTime?.toString() || '60',
    allergies: dayContext?.allergies || '',
    servings: dayContext?.servings?.toString() || '2',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const parsed = DayContextSchema.safeParse({
      diet: formData.diet,
      budget: parseFloat(formData.budget),
      cookingTime: parseInt(formData.cookingTime, 10),
      allergies: formData.allergies,
      servings: parseInt(formData.servings, 10),
    });

    if (!parsed.success) {
      setValidationError(parsed.error.issues.map((err: z.ZodIssue) => err.message).join(', '));
      return;
    }

    setDayContext(parsed.data);
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-6">Daily Cooking Profile</h2>
      {validationError && (
        <div className="mb-4">
          <ErrorState message={validationError} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diet Preference</label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 border p-2"
              value={formData.diet}
              onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
              placeholder="e.g., Vegan, Keto, Omnivore"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Budget ($)</label>
            <input
              type="number"
              min="1"
              step="any"
              className="w-full rounded-lg border-gray-300 border p-2"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Cooking Time (mins/day)</label>
            <input
              type="number"
              min="1"
              className="w-full rounded-lg border-gray-300 border p-2"
              value={formData.cookingTime}
              onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Servings per Meal</label>
            <input
              type="number"
              min="1"
              className="w-full rounded-lg border-gray-300 border p-2"
              value={formData.servings}
              onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Allergies / Dislikes (Optional)</label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 border p-2"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              placeholder="e.g., Peanuts, shellfish, no cilantro"
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit">Generate Plan</Button>
        </div>
      </form>
    </Card>
  );
};
