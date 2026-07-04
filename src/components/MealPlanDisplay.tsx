import { Card } from './common/UI';
import type { MealPlan } from '../types';
import { Clock } from 'lucide-react';

export const MealPlanDisplay = ({ mealPlan }: { mealPlan: MealPlan }) => {
  const meals = [
    { title: 'Breakfast', data: mealPlan.breakfast },
    { title: 'Lunch', data: mealPlan.lunch },
    { title: 'Dinner', data: mealPlan.dinner },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Today's Meal Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {meals.map(({ title, data }) => (
          <Card key={title} className="flex flex-col h-full hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">{title}</h3>
            <h4 className="text-xl font-bold mb-2">{data.name}</h4>
            <p className="text-gray-600 mb-4 text-sm flex-grow">{data.description}</p>
            
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-900 mb-1">Ingredients:</h5>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {data.ingredients.map((ing, idx) => (
                  <li key={idx} className="truncate" title={ing}>{ing}</li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
              <Clock size={16} className="mr-1" />
              <span>{data.prepTime}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
