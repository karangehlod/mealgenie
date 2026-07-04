
import { FadeIn, StaggerContainer, StaggerItem } from './common/Animations';
import { usePlannerStore } from '../store/usePlannerStore';
import { Wallet, Clock, Utensils, Users, HeartPulse, ShoppingBasket } from 'lucide-react';

export const DashboardWidgets = () => {
  const { dayContext, mealPlan, groceryList, budgetCheck } = usePlannerStore();

  if (!dayContext) return null;

  const widgets = [
    {
      title: 'Diet',
      value: dayContext.diet[0] + (dayContext.diet.length > 1 ? ` +${dayContext.diet.length - 1}` : ''),
      icon: HeartPulse,
      color: 'text-rose-500 dark:text-rose-400',
      bg: 'bg-rose-100 dark:bg-rose-950/30',
    },
    {
      title: 'Meals',
      value: mealPlan ? '3 Prepared' : 'Pending',
      icon: Utensils,
      color: 'text-orange-500 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-950/30',
    },
    {
      title: 'Servings',
      value: `${dayContext.servings} / meal`,
      icon: Users,
      color: 'text-blue-500 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-950/30',
    },
    {
      title: 'Prep Time',
      value: `${dayContext.cookingTime}m max`,
      icon: Clock,
      color: 'text-indigo-500 dark:text-indigo-400',
      bg: 'bg-indigo-100 dark:bg-indigo-950/30',
    },
    {
      title: 'Budget',
      value: budgetCheck ? `$${budgetCheck.estimatedCost.toFixed(2)}` : `$${dayContext.budget}`,
      icon: Wallet,
      color: budgetCheck?.feasible ? 'text-emerald-500 dark:text-emerald-400' : (budgetCheck ? 'text-red-500 dark:text-red-400' : 'text-emerald-500 dark:text-emerald-400'),
      bg: budgetCheck?.feasible ? 'bg-emerald-100 dark:bg-emerald-950/30' : (budgetCheck ? 'bg-red-100 dark:bg-red-950/30' : 'bg-emerald-100 dark:bg-emerald-950/30'),
    },
    {
      title: 'Groceries',
      value: groceryList ? `${Object.values(groceryList).flat().length} Items` : 'Pending',
      icon: ShoppingBasket,
      color: 'text-purple-500 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-950/30',
    },
  ];

  return (
    <FadeIn>
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {widgets.map((widget, idx) => {
          const Icon = widget.icon;
          return (
            <StaggerItem key={idx}>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-850 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center gap-2">
                <div className={`w-10 h-10 rounded-full ${widget.bg} ${widget.color} flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{widget.title}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{widget.value}</p>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </FadeIn>
  );
};
