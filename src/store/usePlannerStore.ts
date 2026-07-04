import { create } from 'zustand';
import type {
  DayContext,
  MealPlan,
  GroceryList,
  Substitution,
  BudgetCheck,
} from '../types';

interface PlannerState {
  dayContext: DayContext | null;
  mealPlan: MealPlan | null;
  groceryList: GroceryList | null;
  substitutions: Substitution[] | null;
  budgetCheck: BudgetCheck | null;
  loading: boolean;
  error: string | null;

  setDayContext: (context: DayContext) => void;
  setMealPlan: (plan: MealPlan) => void;
  setGroceryList: (list: GroceryList) => void;
  setSubstitutions: (subs: Substitution[]) => void;
  setBudgetCheck: (check: BudgetCheck) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const usePlannerStore = create<PlannerState>((set) => ({
  dayContext: null,
  mealPlan: null,
  groceryList: null,
  substitutions: null,
  budgetCheck: null,
  loading: false,
  error: null,

  setDayContext: (dayContext) => set({ dayContext }),
  setMealPlan: (mealPlan) => set({ mealPlan }),
  setGroceryList: (groceryList) => set({ groceryList }),
  setSubstitutions: (substitutions) => set({ substitutions }),
  setBudgetCheck: (budgetCheck) => set({ budgetCheck }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({
    dayContext: null,
    mealPlan: null,
    groceryList: null,
    substitutions: null,
    budgetCheck: null,
    loading: false,
    error: null,
  }),
}));
