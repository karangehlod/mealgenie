import { useEffect, useState } from 'react';
import { Layout } from './components/layout/Layout';
import { DayContextForm } from './components/DayContextForm';
import { MealPlanDisplay } from './components/MealPlanDisplay';
import { GroceryListDisplay } from './components/GroceryListDisplay';
import { SubstitutionsPanel } from './components/SubstitutionsPanel';
import { BudgetFeasibility } from './components/BudgetFeasibility';
import { Spinner, ErrorState, Button } from './components/common/UI';
import { usePlannerStore } from './store/usePlannerStore';
import { agent } from './services/agent';

export default function App() {
  const {
    dayContext,
    mealPlan,
    groceryList,
    substitutions,
    budgetCheck,
    loading,
    error,
    setMealPlan,
    setGroceryList,
    setSubstitutions,
    setBudgetCheck,
    setLoading,
    setError,
    reset
  } = usePlannerStore();

  const [currentStep, setCurrentStep] = useState<string>('');

  // Step 1: Generate Meal Plan
  useEffect(() => {
    if (dayContext && !mealPlan && !loading && !error) {
      const generate = async () => {
        setLoading(true);
        setCurrentStep('Generating meal plan...');
        try {
          const plan = await agent.generateMealPlan(dayContext);
          setMealPlan(plan);
        } catch (err: any) {
          setError(err.message || "Failed to generate meal plan.");
        } finally {
          setLoading(false);
          setCurrentStep('');
        }
      };
      generate();
    }
  }, [dayContext, mealPlan, loading, error, setMealPlan, setLoading, setError]);

  // Step 2: Generate Grocery List
  useEffect(() => {
    if (mealPlan && !groceryList && !loading && !error) {
      const generate = async () => {
        setLoading(true);
        setCurrentStep('Extracting grocery list...');
        try {
          const list = await agent.generateGroceryList(mealPlan);
          setGroceryList(list);
        } catch (err: any) {
          setError(err.message || "Failed to extract grocery list.");
        } finally {
          setLoading(false);
          setCurrentStep('');
        }
      };
      generate();
    }
  }, [mealPlan, groceryList, loading, error, setGroceryList, setLoading, setError]);

  // Step 3: Get Substitutions
  useEffect(() => {
    if (mealPlan && groceryList && !substitutions && !loading && !error) {
      const generate = async () => {
        setLoading(true);
        setCurrentStep('Analyzing dietary substitutions...');
        try {
          const subs = await agent.getSubstitutions(mealPlan);
          setSubstitutions(subs);
        } catch (err: any) {
          setError(err.message || "Failed to get substitutions.");
        } finally {
          setLoading(false);
          setCurrentStep('');
        }
      };
      generate();
    }
  }, [mealPlan, groceryList, substitutions, loading, error, setSubstitutions, setLoading, setError]);

  // Step 4: Check Budget
  useEffect(() => {
    if (groceryList && substitutions && dayContext && !budgetCheck && !loading && !error) {
      const generate = async () => {
        setLoading(true);
        setCurrentStep('Calculating budget feasibility...');
        try {
          const check = await agent.checkBudget(groceryList, dayContext.budget);
          setBudgetCheck(check);
        } catch (err: any) {
          setError(err.message || "Failed to check budget.");
        } finally {
          setLoading(false);
          setCurrentStep('');
        }
      };
      generate();
    }
  }, [groceryList, substitutions, dayContext, budgetCheck, loading, error, setBudgetCheck, setLoading, setError]);

  const handleRetry = () => {
    setError(null);
  };

  return (
    <Layout>
      {/* Form is always at the top, if they want to restart */}
      {!dayContext ? (
        <DayContextForm />
      ) : (
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="text-sm font-medium text-gray-700">
            Planning for: {dayContext.diet} • ${dayContext.budget}/day • {dayContext.servings} servings
          </div>
          <Button variant="secondary" onClick={reset}>Start Over</Button>
        </div>
      )}

      <div className="space-y-8 pb-12">
        {mealPlan && <MealPlanDisplay mealPlan={mealPlan} />}
        {groceryList && <GroceryListDisplay groceryList={groceryList} />}
        {substitutions && substitutions.length > 0 && <SubstitutionsPanel substitutions={substitutions} />}
        {budgetCheck && dayContext && <BudgetFeasibility budgetCheck={budgetCheck} budget={dayContext.budget} />}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Spinner size="lg" />
            <p className="text-gray-500 font-medium animate-pulse">{currentStep}</p>
          </div>
        )}

        {error && (
          <ErrorState message={error} onRetry={handleRetry} />
        )}
      </div>
    </Layout>
  );
}
