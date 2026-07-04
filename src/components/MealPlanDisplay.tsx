import { Card } from './common/UI';
import type { MealPlan } from '../types';
import { Clock, Flame, Utensils } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from './common/Animations';

export const MealPlanDisplay = ({ mealPlan }: { mealPlan: MealPlan }) => {
  const meals = [
    { title: 'Breakfast', data: mealPlan.breakfast },
    { title: 'Lunch', data: mealPlan.lunch },
    { title: 'Dinner', data: mealPlan.dinner },
  ];

  return (
    <FadeIn className="space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-850 pb-4">
        <Utensils className="text-blue-600 dark:text-blue-400" size={28} />
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Today's Meal Plan</h2>
      </div>
      
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {meals.map(({ title, data }) => (
          <StaggerItem key={title}>
            <Card noPadding className="h-full flex flex-col group hover:-translate-y-1 hover:shadow-xl duration-300">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-850 dark:to-indigo-950/20 p-6 border-b border-gray-100 dark:border-slate-850">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase mb-1">{title}</h3>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{data.name}</h4>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed mb-6">{data.description}</p>
                
                <div className="mb-6 flex-grow">
                  <h5 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">Main Ingredients</h5>
                  <div className="flex flex-wrap gap-2">
                    {data.ingredients.map((ing, idx) => (
                      <span key={idx} className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-md font-medium">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 dark:text-slate-400 pt-4 border-t border-gray-100 dark:border-slate-850 mt-auto">
                  <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full">
                    <Clock size={14} />
                    <span>{data.prepTime}</span>
                  </div>
                  {data.calories && (
                    <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 px-3 py-1.5 rounded-full">
                      <Flame size={14} />
                      <span>{data.calories} kcal</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </FadeIn>
  );
};
